import { type InsertTaskSchema } from '~~/server/lib/db/schema';
import { ClientInsertTask } from "~~/shared/validation";
import { notifyPusherChannel } from '~~/server/lib/pusher';
import { githubService, projectService, taskService } from '~~/server/services';
import { validateBody } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, ClientInsertTask);
    const projectId = validateRouterParam(event, 'id');

    // Get project from router param
    const project = await projectService.getProjectById(projectId);
    if (!project) throw createError({
        status: 404,
        statusText: 'Project not found',
    });

    // Ensure user has permission in project's org
    await ensureOrganizationPermission(event, project.organizationId, {
        task: ['create']
    });

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
    );

    const dbInsertionBody: InsertTaskSchema = {
        ...insertionBody,
        creatorId: event.context.user.id,
        ghIssueNodeId: createdIssue.node_id,
        ghIssueNumber: createdIssue.number,
        projectId: project.id,
    };

    // Insert the task into DB
    const { error } = await taskService.insertTask(dbInsertionBody);
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