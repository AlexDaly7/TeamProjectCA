import env from '../lib/env';
import { taskService } from '../services';
import { Webhooks } from '@octokit/webhooks';

const webhooks = new Webhooks({ secret: env.GITHUB_APP_WEBHOOK_SECRET });

export default defineEventHandler(async (event) => {
    // It expects we send back a response header as soon as possible

    // Verify the signature
    const signature = getHeader(event, 'x-hub-signature-256');
    const rawBody = await readRawBody(event);
    if (!signature || !rawBody)
        throw createError({
            statusCode: 401,
            statusMessage: 'Bad Request',
            message: 'Missing signature or request body',
        });

    const isValid = await webhooks.verify(rawBody, signature);
    if (!isValid)
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
            message: 'Invalid signature',
        });

    // Now that we've verified the request is from GitHub, do the updates
    setResponseStatus(event, 202, 'Accepted');

    const body = await readBody(event);

    const githubEvent = getHeader(event, 'x-github-event');

    if (githubEvent !== 'issues') return;
    if (body.action !== 'closed' && body.action !== 'reopened') return;

    // We know somebody closed/reopened an issue.

    const task = await taskService.getTaskByGitHubIssueNodeId(body.issue.node_id);
    if (!task) return;

    const newProgress = body.action === 'closed' ? 1 : 0;

    await taskService.updateTask(task.id, {
        progress: newProgress,
    });
});
