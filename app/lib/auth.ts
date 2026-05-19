import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db/index";
import env from "./env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    advanced: {
        database: {
            generateId: false,
        },
    },
     socialProviders: {
        github: {
            clientId: env.Auth_GITHUB_CLIENT_ID,
            clientSecret: env.Auth_GITHUB_CLIENT_SECRET,
        },
    },
});