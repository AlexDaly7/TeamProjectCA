import { Octokit } from "octokit";

export async function verifyGitHubRepoAccess(ghToken: string, repoId: number): Promise<boolean> {
    const octokit = new Octokit({ auth: ghToken });
    const repos = await octokit.rest.repos.listForAuthenticatedUser();

    const found = repos.data.find((repo) => { repo.id === repoId });

    return !!found;
}