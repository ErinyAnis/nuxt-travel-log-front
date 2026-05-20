import { eq, and } from "drizzle-orm";
import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";
import slugify from "slug";
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

export default defineEventHandler(async (event) => {
    if (!event.context.user) {
        return sendError(
            event,
            createError({
                statusCode: 401,
                statusMessage: "Unauthorized"
            }),
        );
    }

    const result = await readValidatedBody(event, InsertLocation.safeParse);

    if (!result.success) {
        const statusMessage = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");

        const data = result.error.issues.reduce(
            (errors, issue) => {
                errors[issue.path.join("")] = issue.message;
                return errors;
            },
            {} as Record<string, string>,
        );
        return sendError(
            event,
            createError({
                statusCode: 422,
                statusMessage,
                data
            }),
        );
    }

    try {
        const existingLocation = await db.query.location.findFirst({
            where:
                and(
                    eq(location.name, result.data.name),
                    eq(location.userId, event.context.user.id),
                )
        });

        if (existingLocation) {
            return sendError(
                event,
                createError({
                    statusCode: 409,
                    statusMessage: `A location with the name already exists.`,
                }),
            );
        }

        let slug = slugify(result.data.name);
        let existing = !!(await db.query.location.findFirst({
            where: eq(location.slug, slug),
        }));

        while (existing) {
            const id = nanoid();
            const idSlug = `${slug}-${id}`;
            existing = !!(await db.query.location.findFirst({
                where: eq(location.slug, idSlug),
            }));
            if (!existing) {
                slug = idSlug;
            }
        }

        const [created] = await db.insert(location).values({
            ...result.data,
            slug,
            userId: event.context.user.id
        }).returning();

        return created;
    } catch (e) {
        console.error("Database error:", e);

        const error = e as any;
        if (error.message?.includes("SQLITE_CONSTRAINT") ||
            error.code === "SQLITE_CONSTRAINT" ||
            String(error).includes("UNIQUE constraint failed")) {
            return sendError(
                event,
                createError({
                    statusCode: 409,
                    statusMessage: "A location with this name already exists.",
                }),
            );
        }

        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        });
    }
});
