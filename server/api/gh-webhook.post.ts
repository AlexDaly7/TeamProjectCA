import { githubService, projectService, taskService } from "../services";

export default defineEventHandler(async (event) => {
    setResponseStatus(event, 202, 'Accepted');

    const body = await readBody(event);

    const signature = getHeader(event, 'x-hub-signature-256');
    const githubEvent = getHeader(event, 'x-github-event');

    if (githubEvent !== 'issues') return;
    if (body.action !== 'closed' && body.action !== 'reopened' ) return;

    // We know somebody closed/reopened an issue.

    const task = await taskService.getTaskByGitHubIssueNodeId(body.issue.node_id);
    if (!task) return;
    
    const newProgress = body.action === 'closed' ? 1 : 0;

    await taskService.updateTask(task.id, {
        progress: newProgress
    });
});