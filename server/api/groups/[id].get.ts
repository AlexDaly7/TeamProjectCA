import { getUserGroup } from "~~/lib/db/queries/groups";
import validateRouterParam from "~~/server/utils/validateRouterParam";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const groupId = validateRouterParam(event, 'id');

    const group = await getUserGroup(userId, groupId);
    if (!group) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not found',
            message: 'You are not a part of any groups with that ID.',
        });
    }

    return group;
});