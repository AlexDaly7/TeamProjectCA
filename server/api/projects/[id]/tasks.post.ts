import { createTask } from '~~/lib/db/queries/tasks';
import { ClientInsertTask, InsertTaskSchema } from '~~/lib/db/schema';
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


    // Create the issue on GitHub
    const createdIssue = await githubService.createIssue(
        project.repoOwner,
        project.repoName,
        project.id,
        body,
        event.context.user.name,
    );

    const insertionBody: InsertTaskSchema = {
        ...body,
        ghIssueNodeId: createdIssue.node_id,
        ghIssueNumber: createdIssue.number,
        projectId,
    };

    // Insert the task into DB
    const result = await createTask(insertionBody);
    if (!result[0] || !result[0].id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "There was a problem inserting task into table."
        });
    }

    setResponseStatus(event, 204);
});