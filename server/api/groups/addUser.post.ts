import { ensureUserInGroup } from "~~/server/utils/userPermission";
import { checkUser, zUser } from "~~/lib/db/queries/auth";
import { addUserToGroup } from "~~/lib/db/queries/groups";


export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const body = await validateBody(event, zUser);
    const result = await checkUser(body.userName);
    if(!result[0]) {
        throw createError({
            statusCode: 404,
            statusMessage: "Username not found."
        });
    }
    console.log(result);
    try {
        const insertResult = await addUserToGroup(result[0].field1, body.groupId);
        if(!insertResult.rows) {
            throw createError({
                statusCode:400,
                statusMessage:"There was a problem adding the user to the group"
            });
        }
        return insertResult;
    } catch(error) {
        throw createError({
            statusCode:500,
            statusMessage: "Internal Server Error",
        })
    }
});