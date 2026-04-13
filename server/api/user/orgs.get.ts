import { auth } from '~~/server/lib/auth/auth';

export default defineAuthenticatedEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session) throw createError({ statusCode: 401 });

    const allOrgs = await auth.api.listOrganizations({ headers: event.headers });

    const activeOrgId = session.session.activeOrganizationId;
    if (!activeOrgId) {
        return {
            active: null,
            all: allOrgs,
        };
    } else {
        const activeOrg = await auth.api.getFullOrganization({
            headers: event.headers,
            query: {
                organizationId: activeOrgId,
            },
        });

        return {
            active: activeOrg,
            all: allOrgs,
        };
    }
});
