/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./app/lib/db/migrations",
    schema: "./app/lib/db/schema/index.ts",
    casing: "snake_case",
    dialect: "turso",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.NODE_ENV === "development"
            ? undefined
            : process.env.TURSO_AUTH_TOKEN,
    },
});