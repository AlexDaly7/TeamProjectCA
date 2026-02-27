import { getUserProject } from "~~/lib/db/queries/projects";
import validateRouterParam from "~~/server/utils/validateRouterParam";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const projectId = validateRouterParam(event, 'id');

    const project = await getUserProject(userId, projectId);
    if (!project) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
            message: 'You do not have access to any projects with that ID.',
        });
    }

    return project;
});