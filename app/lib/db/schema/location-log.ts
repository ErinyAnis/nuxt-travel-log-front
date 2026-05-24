import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { location } from "./location";
import { user } from "./auth";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const locationLog = sqliteTable("locationLog", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    startedAt: int().notNull(),
    endedAt: int().notNull(),
    lat: real().notNull(),
    long: real().notNull(),
    locationId: int().notNull().references(() => location.id),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationlogRelations = relations(locationLog, ({ one }) => ({
    location: one(location, {
        fields: [locationLog.locationId],
        references: [location.id]
    })
}));

export const InsertLocationLog = z.object({
    name: z.string().min(1, "Required").max(100),
    description: z.string().max(1000).nullable().optional(),
    startedAt: z.number().int(),
    endedAt: z.number().int(),
    lat: z.number().min(-90).max(90),
    long: z.number().min(-180).max(180),
}).superRefine((values, context) => {
    if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start Date must be before End Date",
            path: ["startedAt"],
        });
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End Date must be after Start Date",
            path: ["endedAt"],
        });
    }
});

export type InsertLocationLog = z.infer<typeof InsertLocationLog>;
export type SelectLocationLog = typeof locationLog.$inferSelect;