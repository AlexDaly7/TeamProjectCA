import { modifyTask } from "~~/lib/db/queries/tasks";
import { ModifyTask } from "~~/lib/db/schema";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, ModifyTask);
    const taskId = validateRouterParam(event, 'id');

    const result = await modifyTask(taskId, body);
    if (result.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "Task to update not found.",
        });
    }

    setResponseStatus(event, 204)
});