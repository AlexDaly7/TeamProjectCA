import { deleteTask } from "~~/lib/db/queries/tasks";
import { DeleteTask } from "~~/lib/db/schema";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, DeleteTask);

    const result = await deleteTask(body);
    if (!result[0] || !result[0].id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "There was a problem while deleting the task.",
        });
    }

    return { id: result[0].id };
});
