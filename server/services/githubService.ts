import { Octokit } from "octokit"
import githubApp from "../lib/octokit";

export const user = {
    getInfo: async (token: string) => {
        const userOctokit = new Octokit({ auth: token });
        const { data } = await userOctokit.rest.users.getAuthenticated();
        return data;
    }
};

export async function createIssue(repoOwner: string, repoName: string, title: string, creator: string) {
    const repoInstallation = await githubApp.octokit.rest.apps.getRepoInstallation({ owner: repoOwner, repo: repoName });
    if (!repoInstallation.data) {
        console.error('Failed to get installation data.');

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
        });
    }

    const installationOctokit = await githubApp.getInstallationOctokit(repoInstallation.data.id);

    const createdIssue = await installationOctokit.rest.issues.create({
        owner: repoOwner,
        repo: repoName,
        title: `[Task] ${title}`,
        body: `Task created by \`${creator}\`.`,
    });
    if (!createdIssue) {
        console.error('Failed to create GitHub issue', repoOwner, repoName, title);

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
        });
    }

    return createdIssue.data.id;
}
