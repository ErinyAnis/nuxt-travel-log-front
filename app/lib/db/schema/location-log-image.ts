import { z } from "zod";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { locationLog } from "./location-log";
import { relations } from "drizzle-orm";

export const locationLogImage = sqliteTable("locationLogImage", {
    id: int().primaryKey({ autoIncrement: true }),
    key: text().notNull(),
    locationLogId: int().notNull().references(() => locationLog.id),
    userId: int().notNull(),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationlogImageRelations = relations(locationLogImage, ({ one }) => ({
    locationLog: one(locationLog, {
        fields: [locationLogImage.locationLogId],
        references: [locationLog.id]
    }),
}));

export const InsertLocationLogImage = z.object({
    key: z.string().regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key"),
});

export type InsertLocationLogImage = z.infer<typeof InsertLocationLogImage>;
export type SelectLocationLogImage = typeof locationLogImage.$inferSelect;