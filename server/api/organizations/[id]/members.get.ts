import { auth } from '~~/server/lib/auth/auth';

export default defineAuthenticatedEventHandler(async (event) => {
    const orgId = validateRouterParam(event, 'id', false);
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session) throw createError({ statusCode: 401 });

    const members = await auth.api.listMembers({
        headers: event.headers,
        query: {
            organizationId: orgId,
        },
    });

    // If has project create permissions, aka is admin, also show invites.
    const { success, error } = await auth.api.hasPermission({
        headers: event.headers,
        body: {
            organizationId: orgId,
            permissions: {
                project: ['create'],
            },
        },
    });

    if (error) {
        return { members, invitations: null };
    } else {
        const invitations = await auth.api.listInvitations({
            headers: event.headers,
            query: {
                organizationId: orgId,
            },
        });

        return { members, invitations };
    }
});
