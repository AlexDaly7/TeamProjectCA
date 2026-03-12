import { auth } from "~~/lib/auth"

export default defineAuthenticatedEventHandler(async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session) throw createError({ statusCode: 401 });

    const sessions = await auth.api.listSessions({ headers: event.headers });
    return sessions;
});