import { int, sqliteTable, text, real, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import { relations } from "drizzle-orm";
import { locationLog, type SelectLocationLog } from "./location-log";
import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "../../zod-schemas";

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

export const locationsRelations = relations(location, ({ many }) => ({
    locationLogs: many(locationLog),
}))

export const InsertLocation = createInsertSchema(location, {
    name: NameSchema,
    description: DescriptionSchema,
    lat: LatSchema,
    long: LongSchema
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

export type SelectLocation = typeof location.$inferSelect;
export type SelectLocationWithLogs = SelectLocation & {
    locationLogs: SelectLocationLog[],
};