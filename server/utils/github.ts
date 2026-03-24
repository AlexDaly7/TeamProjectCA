import { Octokit } from "octokit";

export async function verifyGitHubRepoAccess(ghToken: string, fullRepo: string): Promise<{ valid: false } | { valid: true, id: number, name: string, owner: string }> {
    const [ owner, repo ] = fullRepo.split('/');
    if (!owner || !repo) throw Error('Invalid repo');

    const octokit = new Octokit({ auth: ghToken });
    const repoInfo = await octokit.rest.repos.get({ owner, repo });

    // TODO: ensure the user has the same perms as the bot
    if (!repoInfo.data) return { valid: false };

    return {
        valid: true,
        id: repoInfo.data.id,
        name: repo,
        owner,
    };
}
