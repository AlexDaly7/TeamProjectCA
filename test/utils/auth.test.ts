import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { organization, testUtils } from 'better-auth/plugins';

import { ac, owner, admin, member } from '../../server/lib/auth/auth-permissions';
import * as schema from '../../server/lib/db/schema';
import db from '../../server/lib/db';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
    }),
    user: {
        deleteUser: {
            enabled: true,
        },
    },
    plugins: [
        testUtils(),
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
                        },
                    };
                },
            },
            sendInvitationEmail: async (data) => {
                // mock
            },
        }),
    ],
});
