import { createTask } from '~~/lib/db/queries/tasks';
import { InsertTask } from '~~/lib/db/schema';
import { validateBody } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await validateBody(event, InsertTask);

    const result = await createTask(body);
    if (!result[0] || !result[0].id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "There was a problem inserting task into table."
        });
    }

    return { id: result[0].id };
});