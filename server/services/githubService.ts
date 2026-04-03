import { Octokit } from "octokit"
import githubApp from "../lib/octokit";
import { type InsertTaskSchema, type TasksSchema } from "~~/server/lib/db/schema";
import { taskService } from ".";
import { type Endpoints } from "@octokit/types";

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
    values: Omit<InsertTaskSchema, 'creatorId' | 'ghIssueNodeId' | 'ghIssueNumber' | 'projectId'>,
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
        {
            title: values.title,
            description: values.description ?? undefined,
            progress: 0,
            startTime: values.startTime,
            endTime: values.endTime,
        },
        {
            taskCreatorName,
            projectId,
        },
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

// Update
export async function updateIssue(
    repoOwner: string,
    repoName: string,
    projectId: number,
    values: InsertTaskSchema,
    creatorName: string,
    prevValues: TasksSchema,
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

    const issueGeneratorBody: InsertTaskSchema = {
        title: values.title ?? prevValues.title,
        description: values.description ?? prevValues.description,
        parentId: values.parentId ?? prevValues.parentId,
        startTime: values.startTime ?? prevValues.startTime,
        endTime: values.endTime ?? prevValues.endTime,
        order: values.order ?? prevValues.order,
        creatorId: prevValues.creatorId,
        ghIssueNodeId: prevValues.ghIssueNodeId,
        ghIssueNumber: prevValues.ghIssueNumber,
        projectId: prevValues.projectId,
        progress: values.progress ?? prevValues.progress,
    };

    const updatePayload: Endpoints['PATCH /repos/{owner}/{repo}/issues/{issue_number}']['parameters'] = {
        ...generateGithubIssue(
            {
                name: repoName,
                owner: repoOwner,
            },
            issueGeneratorBody,
            {
                taskCreatorName: creatorName,
                projectId,
            }
        ),
        issue_number: prevValues.ghIssueNumber
    }

    const updatedIssue = await installationOctokit.rest.issues.update(updatePayload)

    if (!updatedIssue) {
        console.error('Failed to update GitHub issue', repoOwner, repoName, values);

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }

    // Parent ID changed
    if ((values.parentId ?? null) !== (prevValues.parentId ?? null)) {
        // If the parent changed and the parentId is now blank, remove the subtask
        if (!values.parentId && prevValues.parentId) {
            await installationOctokit.rest.issues.removeSubIssue({
                issue_number: prevValues.parentId,
                owner: repoOwner,
                repo: repoName,
                sub_issue_id: Number(prevValues.ghIssueNodeId),
            });
        } else if (values.parentId) {
            // otherwise set new parent ID
            const parentTask = await taskService.getTask(values.parentId); 
            if (!parentTask) throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request', // parent doesn't exist
                message: 'Parent task doesn\'t exist.'
            })

            await installationOctokit.rest.issues.addSubIssue({
                issue_number: parentTask.ghIssueNumber,
                owner: repoOwner,
                repo: repoName,
                sub_issue_id: updatedIssue.data.id,
            });
        }
        // Otherwise if we have no parent Id but also previously had no parentID, do nothing
    }

    return updatedIssue.data;
}


// Delete
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
