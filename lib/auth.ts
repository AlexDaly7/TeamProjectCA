import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { organization } from "better-auth/plugins";

import { ac, owner, admin, member } from './auth-permissions';
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
    plugins: [
        organization({
            ac,
            roles: {
                owner,
                admin,
                member,
            }
        }),
    ],
});