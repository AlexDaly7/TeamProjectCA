import { createProject } from "~~/lib/db/queries/projects";
import { ClientInsertProject } from "~~/lib/db/schema";
import { getUserGitHubAuthToken } from "~~/server/utils/auth";
import { verifyGitHubRepoAccess } from "~~/server/utils/github";
import { validateBody } from "~~/server/utils/validation";


export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;

    const bodyData = await validateBody(event, ClientInsertProject);

    ensureUserInGroup(userId, bodyData.groupId);

    try {
        // Validate GitHub repo id
        const token = await getUserGitHubAuthToken(userId);

        const repoStatus = await verifyGitHubRepoAccess(token, bodyData.repo);
        if (!repoStatus.valid) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Invalid repo'
            });
        }
        
        const createdProjectId = await createProject(repoStatus.id, bodyData.title, bodyData.groupId);

        return { id: createdProjectId };
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