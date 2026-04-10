import { type InsertTaskSchema } from '~~/server/lib/db/schema';
import { ClientInsertTask } from "~~/shared/validation";
import { notifyPusherChannel } from '~~/server/lib/pusher';
import { githubService, projectService, taskService, userService } from '~~/server/services';
import { validateBody } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, ClientInsertTask);
    const projectId = validateRouterParam(event, 'id');
    const assigneeIds = body.assigneeIds ? [...new Set(body.assigneeIds)] : [];

    // Get project from router param
    const project = await projectService.getByIdForUser(projectId, event.context.user.id);
    if (!project) throw createError({
        status: 404,
        statusText: 'Project not found',
    });

    // Ensure user has permission in project's org
    await ensureOrganizationPermission(event, project.organizationId, {
        task: ['create']
    });

    const organizationMemberIds = new Set(
        project.organization.members.map((member) => member.userId),
    );

    if (assigneeIds.some((assigneeId) => !organizationMemberIds.has(assigneeId))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'All assignees must be members of the project organization.',
        });
    }

    const assigneeUsernames = (await userService.getGitHubLogins(assigneeIds))
        .map((user) => user.login);

    const insertionBody: Omit<InsertTaskSchema, 'creatorId' | 'ghIssueNodeId' | 'ghIssueNumber' | 'projectId'> = {
        title: body.title,
        description: body.description ?? null,
        startTime: body.dateRange.start,
        endTime: body.dateRange.end,
        order: body.order ?? null,
        parentId: body.parentId ?? null,
        progress: body.progress,
    };


    // Create the issue on GitHub
    const createdIssue = await githubService.createIssue(
        project.repoOwner,
        project.repoName,
        project.id,
        {
            title: body.title,
            description: body.description ?? null,
            startTime: body.dateRange.start,
            endTime: body.dateRange.end,
            order: body.order ?? null,
            parentId: body.parentId ?? null,
        },
        event.context.user.name,
        assigneeUsernames,
    );

    const dbInsertionBody: InsertTaskSchema = {
        ...insertionBody,
        creatorId: event.context.user.id,
        ghIssueNodeId: createdIssue.node_id,
        ghIssueNumber: createdIssue.number,
        projectId: project.id,
    };

    // Insert the task into DB
    const { error } = await taskService.insertTask(dbInsertionBody, assigneeIds);
    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "There was a problem creating the task."
        });
    }

    // Notify users in pusher channel
    await notifyPusherChannel(projectId);

    setResponseStatus(event, 204);
});
