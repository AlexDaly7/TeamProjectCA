import defineAuthenticatedEventHandler from "~~/server/utils/defineAuthenticatedEventHandler";
import { Octokit } from 'octokit';
import { getUserGitHubAuthToken } from "~~/server/utils/auth";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const token = await getUserGitHubAuthToken(userId);

    const octokit = new Octokit({ auth: token });

    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();

    const mappedRepos = repos.map((repo) => ({
        owner: repo.owner.login,
        name: repo.name,
        icon: repo.owner.avatar_url,
    }));

    return mappedRepos;
});