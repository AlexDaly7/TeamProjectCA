import { modifyTask } from "~~/lib/db/queries/tasks";
import { ModifyTask } from "~~/lib/db/schema";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, ModifyTask);

    const result = await modifyTask(body);
    if (!result[0] || !result[0].id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "There was a problem while modifying the task.",
        });
    }

    return { id: result[0].id };
});