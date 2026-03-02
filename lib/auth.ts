import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from './db/schema';

import db from "./db";
import env from "./env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
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
                type: 'number',
                required: false,
            },
            selectedProject: {
                type: 'number',
                required: false,
            },
        },
    },
});