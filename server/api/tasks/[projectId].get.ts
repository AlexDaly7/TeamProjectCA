import { getProject } from "~~/lib/db/queries/projects";
import { getTasks } from "~~/lib/db/queries/tasks";
import { ensureUserInGroup } from "~~/server/utils/userPermission";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const projectId = getRouterParam(event, 'projectId');

    if (!projectId || isNaN(Number(projectId))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'A project ID is required',
        });
    }

    const parsedProjectId = Number(projectId);
    
    const project = await getProject(parsedProjectId);
    if (!project) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        });
    }
    
    // TODO: use the other function in validators for this
    await ensureUserInGroup(userId, project.groupId);

    return getTasks(parsedProjectId);
});