import { notifyPusherChannel } from '~~/server/lib/pusher';
import { githubService, taskService } from '~~/server/services';
import { validateRouterParam } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const taskId = validateRouterParam(event, 'id');

    // Get task from DB
    const taskWithProject = await taskService.getTaskWithProject(taskId);
    if (!taskWithProject)
        throw createError({
            status: 404,
            statusText: 'Task not found',
        });

    const { organizationId, repoOwner, repoName, id: projectId } = taskWithProject.project;

    // Ensure user has permission level in org
    await ensureOrganizationPermission(event, organizationId, {
        task: ['delete'],
    });

    // Delete on GitHub
    try {
        await githubService.deleteIssue(repoOwner, repoName, taskWithProject.ghIssueNodeId);
    } catch (error) {
        console.error('Error deleting issue:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }

    // Delete in DB
    const result = await taskService.deleteTask(taskId);
    if (result.length === 0) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'There was a problem while deleting the task.',
        });
    }

    // Notify users in pusher channel
    await notifyPusherChannel(projectId);

    setResponseStatus(event, 204);
});
