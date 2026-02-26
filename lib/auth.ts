import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "./db";
import env from "./env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            scope: [ 'user:email', 'repo' ]
        },
    },
    user: {
        additionalFields: {
            selectedGroup: {
                type: 'string',
                required: false,
                references: {
                    model: 'groups',
                    field: 'id',
                    onDelete: 'set null',
                },
            },
            selectedProject: {
                type: 'string',
                required: false,
                references: {
                    model: 'projects',
                    field: 'id',
                    onDelete: 'set null',
                },
            },
        },
    },
});