export default defineEventHandler(async (event) => {
    const body = await readRawBody(event);

    const signature = getHeader(event, 'x-hub-signature-256');
    const githubEvent = getHeader(event, 'x-github-event');

    console.log(body, signature, githubEvent);

    setResponseStatus(event, 202, 'Accepted');
});