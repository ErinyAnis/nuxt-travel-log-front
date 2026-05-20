import { and, eq } from "drizzle-orm";
import db from "..";
import { location, type InsertLocationType } from "../schema";
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

export async function findLocationByname(data: { name: string }, userId: number) {
    return db.query.location.findFirst({
        where: and(
            eq(location.name, data.name),
            eq(location.userId, userId)
        )
    });
}

export async function findLocationBySlug(slug: string) {
    return !!(await db.query.location.findFirst({
        where: eq(location.slug, slug),
    }));
}

export async function findUniqueSlug(slug: string) {
    let existing = await findLocationBySlug(slug);

    if (!existing) return slug;

    while (true) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;

        const exists = await findLocationBySlug(idSlug);

        if (!exists) {
            return idSlug;
        }
    }
}

export async function insertLocation(insertable: InsertLocationType, slug: string, userId: number) {
    const [created] = await db.insert(location).values({
        ...insertable,
        slug,
        userId,
    }).returning();
    return created;
}