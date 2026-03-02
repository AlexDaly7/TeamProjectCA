import { getUserGroupPermissions } from "~~/lib/db/queries/groups";
import { getUserProject } from "~~/lib/db/queries/projects";

export async function ensureUserInGroup(userId: string, groupId: number) {
    const hasPermissions = await getUserGroupPermissions(userId, groupId);
    
    if (!hasPermissions) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Group not found',
        });
    }
}

export async function ensureUserCanAccessProject(userId: string, projectId: number) {
    const userHasProject = await getUserProject(userId, projectId);
    
    if (!userHasProject) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }
}