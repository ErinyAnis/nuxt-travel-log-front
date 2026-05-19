import {int,sqliteTable,text,real} from "drizzle-orm/sqlite-core";
import { location } from "./location";
import { locationLog } from "./location-log";

export const locationLogImage = sqliteTable("locationLogImage",{
    id: int().primaryKey({autoIncrement: true}),
    key: text().notNull(),
    locationLogId: int().notNull().references(() => locationLog.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});