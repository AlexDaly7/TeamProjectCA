import { listProjects } from "~~/lib/db/queries/projects";
import { ensureUserInGroup } from "~~/server/utils/userPermission";
import validateRouterParam from "~~/server/utils/validateRouterParam";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const groupId = validateRouterParam(event, 'groupId');

    ensureUserInGroup(userId, groupId);

    const groupProjects = await listProjects(groupId);

    return groupProjects;
});