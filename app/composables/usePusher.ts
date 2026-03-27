export const usePusher = () => {
    const { $pusher } = useNuxtApp();

    function subscribeToProject(
        projectId: number, 
        onUpdate: () => void,
    ) {
        const channel = $pusher.subscribe(`project-${projectId}`);
        channel.bind("tasks-updated", onUpdate);

        return channel;
    }

    return {
        subscribeToProject,
    };
}