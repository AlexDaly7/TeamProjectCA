import { listProjects } from "~~/lib/db/queries/projects";
import { ensureUserInOrg } from "~~/server/utils/userPermission";
import validateRouterParam from "~~/server/utils/validateRouterParam";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const orgId = validateRouterParam(event, 'orgId', false);

    await ensureUserInOrg(event, userId, orgId);

    const groupProjects = await listProjects(orgId);

    return groupProjects;
});