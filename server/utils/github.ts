import { Octokit } from "octokit";
import env from "~~/lib/env";

export async function verifyGitHubRepoAccess(ghToken: string, fullRepo: string): Promise<{ valid: false } | { valid: true, id: number }> {
    const [ owner, repo ] = fullRepo.split('/');
    if (!owner || !repo) throw Error('Invalid repo');

    const octokit = new Octokit({ auth: ghToken });
    const repoInfo = await octokit.rest.repos.get({ owner, repo });

    // TODO: ensure the user has the same perms as the bot
    if (!repoInfo.data) return { valid: false };

    return {
        valid: true,
        id: repoInfo.data.id,
    };
}

const serverOctokit = new Octokit({ auth: env.GITHUB_CLIENT_SECRET });

export async function canCreateIssue(owner: string, repo: string) {
    try {
        console.log(`Checking if we can create issues in repo ${owner}/${repo}`);
        
        const { data } = await serverOctokit.rest.repos.get({ owner, repo });

        const hasIssuesEnabled = data.has_issues;
        const hasWritePermission = data.permissions?.push || data.permissions?.admin;

        console.dir({
            hasIssuesEnabled,
            hasWritePermission,
            pushPerms: data.permissions?.push,
            adminPerms: data.permissions?.admin,
            canCreateIssue: hasIssuesEnabled && hasWritePermission,
        });

        return hasIssuesEnabled && hasWritePermission;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error checking if we can create issues in github repo", error);
        }

        return false;
    }
}