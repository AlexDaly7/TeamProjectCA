import { createTask } from '~~/lib/db/queries/tasks';
import { validateBody } from '~~/server/utils/validation';

export default defineAuthenticatedEventHandler(async (event) => {
    const projectId = getRouterParam(event, "projectId");
    if (!projectId || isNaN(Number(projectId))) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "A valid project ID is required."
        });
    } try {
        const body = await readBody(event);
        let result = await createTask(Number(projectId), body.title, body.desc, body.startTime, body.endTime);
        console.log(result);
        if (!result || !result[0] || !result[0].id) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "There was a problem inserting task into table."
            });
        }
        return { id: result[0].id };
    } catch(error) {
        if(error instanceof Error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error"
            })
        }
    }
    
});