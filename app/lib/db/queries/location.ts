import { and, eq } from "drizzle-orm";
import db from "..";
import { location, type InsertLocationType } from "../schema";
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

export async function findLocation(slug: string, userId: number) {
    return db.query.location.findFirst({
        where: and(
            eq(location.slug, slug),
            eq(location.userId, userId)
        ),
        with: {
            locationLogs: true
        }
    });
}

export async function findLocations(userId: number) {
    return db.query.location.findMany({
        where: eq(location.userId, userId),
    });
}

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

export async function updateLocationBySlug(updates: InsertLocationType, slug: string, userId: number) {
    const [updated] = await db.update(location).set(updates).where(and(
        eq(location.slug,slug),
        eq(location.userId, userId),
    )).returning();
    return updated;
}