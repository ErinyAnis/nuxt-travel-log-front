import { int, sqliteTable, text, real, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import type {z} from "zod";

export const location = sqliteTable("location", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    lat: real().notNull(),
    long: real().notNull(),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, (t) => [
    unique().on(t.name, t.userId)
]);

export const InsertLocation = createInsertSchema(location, {
    name: (field) => field
        .min(1, "Required")
        .max(100),

    description: (field) => field
        .max(1000),

    lat: (field) => field
        .min(-90)
        .max(90),

    long: (field) => field
        .min(-180)
        .max(180),
}).omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
    userId: true
});

export type InsertLocationType = {
    name: string;
    description?: string | null;
    lat: number;
    long: number;
};