import { createTask } from '~~/lib/db/queries/tasks';
import { ClientInsertTask, InsertTaskSchema } from '~~/lib/db/schema';
import { githubService, projectService } from '~~/server/services';
import { validateBody } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, ClientInsertTask);

    const project = await projectService.getProjectById(body.projectId);
    if (!project) throw createError({
        status: 404,
        statusText: 'Project not found',
    });

    await ensureOrganizationPermission(event, project.organizationId, {
        task: ['create']
    });

    const createdIssueId = await githubService.createIssue(
        project.repoOwner,
        project.repoName,
        body.title,
        event.context.user.name,
    );

    const insertionBody: InsertTaskSchema = {
        ...body,
        issueId: String(createdIssueId),
    };

    const result = await createTask(insertionBody);
    if (!result[0] || !result[0].id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "There was a problem inserting task into table."
        });
    }

    return { id: result[0].id };
});