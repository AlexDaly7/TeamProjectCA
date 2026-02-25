import { isUserInGroup } from "~~/lib/db/queries/groups";


export function ensureUserInGroup(userId: string, groupId: number) {
    const isMember = isUserInGroup(userId, groupId);
    if (!isMember) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }
}