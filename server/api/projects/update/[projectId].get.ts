import pusher from '~~/lib/pusher';
import z from 'zod';

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const projectId = validateRouterParam(event, 'projectId');

    // ensureUserInGroup(userId, groupId);

    pusher.trigger("project"+projectId, "update", {});
});