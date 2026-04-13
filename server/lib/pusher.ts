import Pusher from 'pusher';
import env from '~~/server/lib/env';

export const pusher = new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    useTLS: true,
});

export async function notifyPusherChannel(projectId: number) {
    await pusher.trigger(`project-${projectId}`, 'tasks-updated', null);
}
