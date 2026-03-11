import { Octokit } from "octokit";
import env from "~~/lib/env";

export type IssuePermissionResult = {
  userHasPermission: boolean;
  appHasPermission: boolean;
  issuesEnabled: boolean;
  reason: string;
  canCreate: boolean;
};

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

export async function getRepoIssues(projectId: number) {

}


export async function checkCreateIssuePermissions(
    userToken: string,
    owner: string,
    repo: string
): Promise<IssuePermissionResult> {
    const userOctokit = new Octokit({ auth: userToken });

    console.log(await userOctokit.rest.repos.listForUser());

    // Check user permissions
    const { data: userRepoData } = await userOctokit.rest.repos.get({ owner, repo });

    const userHasWrite = userRepoData.permissions?.push === true || userRepoData.permissions?.admin === true;
    const issuesEnabled = userRepoData.has_issues === true;

    // Check app/bot permissions (using server token)
    const { data: appRepoData } = await serverOctokit.rest.repos.get({ owner, repo });

    const appHasWrite = appRepoData.permissions?.push === true || appRepoData.permissions?.admin === true;

    // Build reason message
    const failures: string[] = [];

    if (!issuesEnabled) {
        failures.push("Issues are disabled for this repository");
    }

    if (!userHasWrite) {
        failures.push("User does not have write access to the repository");
    }

    if (!appHasWrite) {
        failures.push("GitHub App does not have write access to the repository");
    }

    const reason = failures.length > 0
        ? failures.join("; ")
        : "All permissions OK";

    return {
        userHasPermission: userHasWrite && issuesEnabled,
        appHasPermission: appHasWrite && issuesEnabled,
        issuesEnabled,
        reason,
        canCreate: userHasWrite && appHasWrite && issuesEnabled,
    };
}

export async function checkUserIssuePermission(userToken: string, owner: string, repo: string): Promise<boolean> {
    const userOctokit = new Octokit({ auth: userToken });
    const { data } = await userOctokit.rest.repos.get({ owner, repo });

    const hasWrite = data.permissions?.push === true || data.permissions?.admin === true;
    return hasWrite && data.has_issues === true;
}


export async function createIssue(owner: string, repo: string, title: string) {
    const issue = await serverOctokit.rest.issues.create({
        owner,
        repo,
        title
    });

    return issue;
}