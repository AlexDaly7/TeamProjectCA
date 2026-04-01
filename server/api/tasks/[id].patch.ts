import { ModifyTask } from "~~/lib/db/schema";
import { notifyPusherChannel } from "~~/server/lib/pusher";
import { githubService, taskService } from "~~/server/services";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, ModifyTask);
    const taskId = validateRouterParam(event, 'id');

    // Get task from DB
    const taskWithProject = await taskService.getTaskWithProject(taskId)
    if (!taskWithProject) throw createError({
        status: 404,
        statusText: 'Task not found',
    });

    const { organizationId, repoOwner, repoName, id: projectId } = taskWithProject.project;


    // Ensure user has permission level in org
    await ensureOrganizationPermission(event, organizationId, {
        task: ['update']
    });

    // Update on GitHub
    await githubService.updateIssue(
        repoOwner,
        repoName,
        taskWithProject.project.id,
        Object.assign(taskWithProject, body),
        taskWithProject.creator.name,
        taskWithProject,
    );

    // Update in DB
    const { error } = await taskService.updateTask(taskId, body);
    if (error) {
        throw createError({
            status: 400,
            statusText: error.message
        });
    }

    // Notify users in pusher channel
    await notifyPusherChannel(projectId);

    setResponseStatus(event, 204)
});