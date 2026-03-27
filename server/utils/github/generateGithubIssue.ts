import { Endpoints } from "@octokit/types";
import env from "~~/lib/env";

export function generateGithubIssue(
    repo: {
        owner: string,
        name: string,
    },
    task: {
        title: string,
        description?: string | null,
        startTime: Date,
        endTime: Date,
        progress?: number | null,
    },
    morchlar: {
        taskCreatorName: string,
        projectId: number,
    }
): Endpoints['POST /repos/{owner}/{repo}/issues']['parameters'] {
    return {
        owner: repo.owner,
        repo: repo.name,
        title: `[Task] ${task.title}`,
        body: `## Description
${task.description != null ? task.description : '(No description provided).' }

---

## Schedule
**Start Date**: \`${task.startTime.toLocaleDateString("en-US")}\`
**End Date**: \`${task.endTime.toLocaleDateString("en-US")}\`

## Progress
**Completion**: ${task.progress != null ? Math.round(task.progress * 100) : 0}%

---

## Metadata
**Created by**: ${morchlar.taskCreatorName}
[**View on Mórchlár**](${env.BETTER_AUTH_URL}/view-task/${morchlar.projectId})
`
    } 
}