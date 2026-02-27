import { getUserGroupPermissions } from "~~/lib/db/queries/groups";

export async function ensureUserInGroup(userId: string, groupId: number) {
    const hasPermissions = await getUserGroupPermissions(userId, groupId);
    
    if (!hasPermissions) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }
}