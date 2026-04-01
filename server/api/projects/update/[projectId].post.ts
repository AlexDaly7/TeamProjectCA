import { pusher } from '~~/server/lib/pusher';
import { auth } from '~~/lib/auth';
import { getProjectInOrg } from '~~/lib/db/queries/projects';

export default defineAuthenticatedEventHandler(async (event) => {
    const projectId = validateRouterParam(event, 'projectId');

    const session = await auth.api.getSession({ headers: event.headers });
    if (!session) throw createError({ 
        statusCode: 401,
        statusMessage: 'Invalid session.'
    });

    const activeOrgId = session.session.activeOrganizationId;
    if (!activeOrgId) throw createError({ 
        statusCode: 400,
        statusMessage: 'No active organization.'
    });

    await ensureOrganizationPermission(event, activeOrgId, {
        project: ['read'],
    })

    const project = await getProjectInOrg(projectId, activeOrgId);
    if (!project) throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
    });

    try {
        await pusher.trigger(`project-${projectId}`, "tasks-updated", null);
        // Success, no response body
        setResponseStatus(event, 204);
    } catch(error: any) {
        console.error(error);

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        });
    }
});