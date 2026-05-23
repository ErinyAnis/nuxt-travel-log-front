import { InsertLocation } from "~/lib/db/schema";
import slugify from "slug";
import { findLocationByname, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertLocation.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error as any);
    }

    const existingLocation = await findLocationByname(result.data, event.context.user.id);

    if (existingLocation) {
        return sendError(
            event,
            createError({
                statusCode: 409,
                statusMessage: `A location with the name already exists.`,
            }),
        );
    }

    const slug = await findUniqueSlug(slugify(result.data.name));

    try {
        return insertLocation(result.data, slug, event.context.user.id);

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

