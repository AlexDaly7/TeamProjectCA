import { projectService, taskService } from '~~/server/services';
import validateRouterParam from '~~/server/utils/validateRouterParam';

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const projectId = validateRouterParam(event, 'id');

    const project = await projectService.getByIdForUser(projectId, userId);
    if (!project)
        throw createError({
            statusCode: 404,
            statusText: 'Project not found.',
        });

    await ensureOrganizationPermission(event, project.organizationId, {
        project: ['read'],
    });

    const { data: tasks, error } = await tryCatch(taskService.getTasksWithDepthAndPath(projectId));
    if (error) {
        throw createError({
            statusCode: 500,
            statusText: 'Failed to fetch tasks.',
        });
    }

    return {
        ...project,
        tasks,
    };
});
