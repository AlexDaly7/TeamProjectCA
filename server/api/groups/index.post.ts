import { createGroup } from "~~/lib/db/queries/groups";
import { InsertGroup } from "~~/lib/db/schema";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;

    const bodyData = await validateBody(event, InsertGroup);

    try {
        const createdGroupId = await createGroup(userId, bodyData.name);

        return { id: createdGroupId };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);

            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
            });
        }
    }
})