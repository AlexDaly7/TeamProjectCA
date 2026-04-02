import type { InsertProjectSchema } from "~~/server/lib/db/schema";
import { projectService } from "~~/server/services";
import { getUserGitHubAuthToken } from "~~/server/utils/auth";
import { verifyGitHubRepoAccess } from "~~/server/utils/github";
import { validateBody } from "~~/server/utils/validation";
import { ClientInsertProject } from "~~/shared/validation";


export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const bodyData = await validateBody(event, ClientInsertProject);

    await ensureOrganizationPermission(event, bodyData.organizationId, {
        project: ['create']
    });

    try {
        // Validate GitHub repo id
        const token = await getUserGitHubAuthToken(userId);

        const repoStatus = await verifyGitHubRepoAccess(token, bodyData.repoOwner, bodyData.repoName);
        if (!repoStatus.valid) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Invalid repo'
            });
        }

        const projectData: InsertProjectSchema = {
            ...bodyData,
            repoId: repoStatus.id,
        };

        const { data: createdProject, error } = await tryCatch(projectService.createProject(projectData));
        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
                message: 'Failed to create project'
            });
        }

        return { id: createdProject.id };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);

            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
            });
        }
    }
})
