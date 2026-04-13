import Pusher from "pusher-js";

let pusher: Pusher | null = null;

export const usePusher = () => {
    // If we haven't set up pusher and are running on the client
    if (!pusher && import.meta.client) {
        pusher = new Pusher("e41e7620d6ab296d33aa", { 
            cluster: "eu"
        });

        Pusher.logToConsole = true;
    }

    function subscribeToProject(
        projectId: number, 
        onUpdate: () => void,
    ) {
        if (!pusher) return;

        const channelName = `project-${projectId}`;
        const channel = pusher.subscribe(channelName);

        const handler = () => onUpdate();
        
        channel.bind('tasks-updated', handler);

        const unsubscribe = () => {
            channel.unbind('tasks-updated', handler);
            pusher?.unsubscribe(channelName);
        }

        return { unsubscribe };
    }

    return {
        subscribeToProject,
    };
}