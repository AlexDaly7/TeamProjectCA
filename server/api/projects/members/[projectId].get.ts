import { getRepoId } from "~~/lib/db/queries/projects";
import { getTasks } from "~~/lib/db/queries/tasks";
import { ensureUserInGroup } from "~~/server/utils/userPermission";
import { Octokit } from "octokit";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const projectId = getRouterParam(event, 'projectId');

    if (!projectId || isNaN(Number(projectId))) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'A project ID is required',
        });
    }

    const parsedProjectId = Number(projectId);
    
    const repoId = await getRepoId(parsedProjectId);
    const parsedRepoId = String(repoId)
    if (!parsedRepoId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        });
    }

    const token = await getUserGitHubAuthToken(userId);
    const octokit = new Octokit({ auth: token });

    const result = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
        owner: 'AlexDaly7',
        repo: parsedRepoId,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    console.log(result);
});