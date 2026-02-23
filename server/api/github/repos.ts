import { auth } from "~~/lib/auth";
import defineAuthenticatedEventHandler from "~~/server/utils/defineAuthenticatedEventHandler";
import { Octokit } from 'octokit';

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;

    const token = await auth.api.getAccessToken({
        body: {
            providerId: 'github',
            userId,
        },
    });

    const octokit = new Octokit({ auth: token.accessToken });

    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser();

    return repos.map((repo) => ({
        id: repo.id,
        name: repo.full_name,
        owner: {
            name: repo.owner.login,
            avatar: repo.owner.avatar_url,
        },
    }));
});