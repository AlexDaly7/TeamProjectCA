import { Octokit } from "octokit";

export async function verifyGitHubRepoAccess(ghToken: string, owner: string, repo: string): Promise<{ valid: false } | { valid: true, id: number}> {
    const octokit = new Octokit({ auth: ghToken });
    const repoInfo = await octokit.rest.repos.get({ owner, repo });

    if (!repoInfo.data) return { valid: false };

    return {
        valid: true,
        id: repoInfo.data.id,
    };
}
