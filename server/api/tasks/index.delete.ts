import { deleteTask } from "~~/lib/db/queries/tasks";
import { DeleteTask } from "~~/lib/db/schema";
import { githubService, projectService, taskService } from "~~/server/services";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, DeleteTask);

    const taskWithProject = await taskService.getTaskWithProject(body.id)
    if (!taskWithProject) throw createError({
        status: 404,
        statusText: 'Task not found',
    });

    const { organizationId, repoOwner, repoName } = taskWithProject.project;

    await ensureOrganizationPermission(event, organizationId, {
        task: ['delete']
    });

    try {
        await githubService.deleteIssue(repoOwner, repoName, Number(taskWithProject.issueId));
    } catch (error) {
        console.error('Error deleting issue:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }

    const result = await deleteTask(body);
    if (!result[0] || !result[0].id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "There was a problem while deleting the task.",
        });
    }
});
