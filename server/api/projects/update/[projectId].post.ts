import pusher from '~~/lib/pusher';
import z from 'zod';
import { ensureUserInOrg } from '~~/server/utils/userPermission';
import { getTask } from '~~/lib/db/queries/tasks';
import { InsertTask } from '~~/lib/db/schema';

export default defineAuthenticatedEventHandler(async (event) => {
    try {
        const userId = event.context.user.id;
        const projectId = validateRouterParam(event, 'projectId');
        const bodySchema = z.object({
            orgId: z.string(),
            taskId: z.number()
        });
        type BodyType = z.infer<typeof bodySchema>;
        console.log(await readBody(event));
        let body: BodyType = await validateBody(event, bodySchema);

        await ensureUserInOrg(event, userId, body.orgId);
        const task = await getTask(body.taskId);

        if(task) {
            await pusher.trigger("project"+projectId, "update", {
            task: task
        });
        }
        
        return true;
    } catch(error: any) {
        console.log(error?.body);
        throw createError({
            status: 500,
            statusMessage: "An error has occured, "+error
        });
    }
    

});