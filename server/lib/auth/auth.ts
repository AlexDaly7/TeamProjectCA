import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { organization } from "better-auth/plugins";

import { ac, owner, admin, member } from './auth-permissions';
import * as schema from '../db/schema';
import env from "../env";
import resend from "../resend";
import db from "../db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            disableDefaultScope: true,
            scope: [ 'user:email', 'repo' ]
        },
    },
    trustedOrigins: [ env.BETTER_AUTH_URL ],
    user: {
        deleteUser: {
            enabled: true,
        },
    },
    plugins: [
        organization({
            ac,
            roles: {
                owner,
                admin,
                member,
            },
            organizationHooks: {
                // Before an org is created
                beforeCreateOrganization: async ({ organization }) => {
                    // Prepend `org-` to the start of any org name
                    return {
                        data: {
                            ...organization,
                            slug: `org-${organization.slug}`,
                        }
                    }
                }
            },
            sendInvitationEmail: async (data) => {
                const url = `${env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;

                await resend.emails.send({
                    from: 'Invites <invites@morchlar.com>',
                    to: data.email,
                    template: {
                        id: 'organization-invite',
                        variables: {
                            ORG_NAME: data.organization.name,
                            INVITE_LINK: url
                        }
                    }
                });
            }
        }),
    ],
});