import { type ModifyTaskSchema } from '~~/server/lib/db/schema';
import { notifyPusherChannel } from '~~/server/lib/pusher';
import { githubService, projectService, taskService, userService } from '~~/server/services';
import { validateBody, validateRouterParam } from '~~/server/utils/validation';
import { ClientModifyTask } from '~~/shared/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, ClientModifyTask);
    const taskId = validateRouterParam(event, 'id');
    const assigneeIds = body.assigneeIds ? [...new Set(body.assigneeIds)] : body.assigneeIds;

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
        task: ['update'],
    });

    if (assigneeIds !== undefined) {
        const projectWithMembers = await projectService.getByIdForUser(projectId, event.context.user.id);

        if (!projectWithMembers) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Project not found',
            });
        }

        const organizationMemberIds = new Set(projectWithMembers.organization.members.map((member) => member.userId));

        if (assigneeIds.some((assigneeId) => !organizationMemberIds.has(assigneeId))) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'All assignees must be members of the project organization.',
            });
        }
    }

    const assigneeUsernames =
        assigneeIds === undefined
            ? undefined
            : (await userService.getGitHubLogins(assigneeIds)).map((user) => user.login);

    const updateData: ModifyTaskSchema = {
        title: body.title,
        description: body.description,
        parentId: body.parentId,
        startTime: body.dateRange?.start,
        endTime: body.dateRange?.end,
        progress: body.progress,
        order: body.order,
    };

    // Update on GitHub
    await githubService.updateIssue(
        repoOwner,
        repoName,
        taskWithProject.project.id,
        { ...taskWithProject, ...updateData },
        taskWithProject.creator.name,
        taskWithProject,
        assigneeUsernames,
    );

    // Update in DB
    const { error } = await taskService.updateTask(taskId, updateData, assigneeIds);
    if (error) {
        throw createError({
            status: 400,
            statusText: error.message,
        });
    }

    // Notify users in pusher channel
    await notifyPusherChannel(projectId);

    setResponseStatus(event, 204);
});
