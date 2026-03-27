import { Octokit } from "octokit"
import githubApp from "../lib/octokit";
import { ClientInsertTaskSchema } from "~~/lib/db/schema";
import { taskService } from ".";

export const user = {
    getInfo: async (token: string) => {
        const userOctokit = new Octokit({ auth: token });
        const { data } = await userOctokit.rest.users.getAuthenticated();
        return data;
    }
};

export async function createIssue(
    repoOwner: string,
    repoName: string,
    projectId: number,
    values: ClientInsertTaskSchema,
    taskCreatorName: string,
) {
    const repoInstallation = await githubApp.octokit.rest.apps.getRepoInstallation({ owner: repoOwner, repo: repoName });
    if (!repoInstallation.data) {
        console.error('Failed to get installation data.');

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
        });
    }

    const installationOctokit = await githubApp.getInstallationOctokit(repoInstallation.data.id);

    const createdIssue = await installationOctokit.rest.issues.create(generateGithubIssue(
        {
            name: repoName,
            owner: repoOwner,
        },
        values,
        {
            taskCreatorName,
            projectId,
        }
    ));

    if (!createdIssue) {
        console.error('Failed to create GitHub issue', repoOwner, repoName, values);

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
        });
    }

    if (values.parentId) {
        const parentTask = await taskService.getTask(values.parentId); 
        if (!parentTask) throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request', // parent doesn't exist
            message: 'Parent task doesn\'t exist.'
        })

        installationOctokit.rest.issues.addSubIssue({
            issue_number: parentTask.ghIssueNumber,
            owner: repoOwner,
            repo: repoName,
            sub_issue_id: createdIssue.data.id,
        });
    }

    return createdIssue.data;
}

export async function deleteIssue(repoOwner: string, repoName: string, issueNodeId: string) {
    const repoInstallation = await githubApp.octokit.rest.apps.getRepoInstallation({ owner: repoOwner, repo: repoName });
    if (!repoInstallation.data) {
        console.error('Failed to get installation data.');

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
        });
    }

    const installationOctokit = await githubApp.getInstallationOctokit(repoInstallation.data.id);
    
    await installationOctokit.graphql(`
        mutation ($issueId: ID!) {
            deleteIssue(input: {issueId: $issueId}) {
                clientMutationId
            }
        }`,
    { issueId: issueNodeId });
}
