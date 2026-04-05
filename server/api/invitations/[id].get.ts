import { auth } from "~~/server/lib/auth/auth"

export default defineAuthenticatedEventHandler(async (event) => {
    const inviteId = validateRouterParam(event, 'id', false);
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session) throw createError({ statusCode: 401 });

    const invite = await auth.api.getInvitation({
        headers: event.headers,
        query: {
            id: inviteId,
        },
    });

    if (!invite) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
            message: 'Invite not found.'
        });
    } else {
        return invite;
    }
});