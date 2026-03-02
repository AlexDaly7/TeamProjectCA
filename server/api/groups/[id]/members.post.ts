import { getUserByUsername } from "~~/lib/db/queries/auth";
import { addUserToGroup, getUserGroupPermissions } from "~~/lib/db/queries/groups";
import { InsertGroupMember } from "~~/lib/db/schema";


export default defineAuthenticatedEventHandler(async (event) => {
    const groupId = validateRouterParam(event, 'id');
    const userId = event.context.user.id;
    const body = await validateBody(event, InsertGroupMember);

    const requesteePermissions = await getUserGroupPermissions(userId, groupId);
    
    // TEST: Does the group exist and the requestee in the group?
    if (!requesteePermissions) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Group not found',
        });
    }
    // TEST: Is the requestee an owner? TODO: have a permissions system later on so more than the owner can add people to groups
    if (requesteePermissions.role !== 'owner') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only owners can add members to groups.',
        });
    }

    // TEST: Is the role we are assigning lesser than owner?
    if (body.role !== "developer" && body.role !== "reader") {
        throw createError({
            statusCode: 409,
            statusMessage: 'Owners cannot add users with higher or same permissions as them.'
        })
    }


    // TEST: Does the user to be added exist?
    const userToAdd = await getUserByUsername(body.userName);
    if(!userToAdd) {
        throw createError({
            statusCode: 404,
            statusMessage: "User not found",
        });
    }

    // TEST: Is the user to be added already in the group?
    const toBeAddedInGroup = await getUserGroupPermissions(userToAdd.id, groupId);
    if (toBeAddedInGroup) {
        throw createError({
            statusCode: 409,
            statusMessage: "User is already in this group",
        });
    }

    return await addUserToGroup(userToAdd.id, groupId, body.role);
});