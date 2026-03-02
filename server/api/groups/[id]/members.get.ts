import { getGroupMembers } from "~~/lib/db/queries/groups";

export default defineAuthenticatedEventHandler(async (event) => {
    const groupId = validateRouterParam(event, 'id');
    const userId = event.context.user.id;

    await ensureUserInGroup(userId, groupId);

    return getGroupMembers(groupId);
});