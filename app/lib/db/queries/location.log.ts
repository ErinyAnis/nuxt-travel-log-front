import db from "..";
import { locationLog, type InsertLocationLog } from "../schema";

export async function insertLocationLog(insertable: InsertLocationLog, locationId: number, userId: number) {
    const [inserted]=await db.insert(locationLog).values({
        ...insertable,
        locationId,
        userId
    }).returning();

    return inserted;
}