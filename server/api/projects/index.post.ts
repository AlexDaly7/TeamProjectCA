import { createProject } from "~~/lib/db/queries/projects";
import { InsertProject } from "~~/lib/db/schema";
import { getUserGitHubAuthToken } from "~~/server/utils/auth";
import { verifyGitHubRepoAccess } from "~~/server/utils/github";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;

    const bodyData = await validateBody(event, InsertProject);

    ensureUserInGroup(userId, bodyData.groupId);

    try {
        // Validate GitHub repo id
        const token = await getUserGitHubAuthToken(userId);

        const validRepo = await verifyGitHubRepoAccess(token, bodyData.repoId);
        if (!validRepo) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
            });
        }
        
        const createdProjectId = await createProject(bodyData.repoId, bodyData.title, bodyData.groupId);

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