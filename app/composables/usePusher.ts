export const usePusher = () => {
    const { $pusher, $csrfFetch } = useNuxtApp();

    async function updateChannel(projectId: number) {
        console.log('triggering channel update', projectId)
        $csrfFetch(`/api/projects/update/${projectId}`, { method: "POST" });
    }

    function subscribeToProject(
        projectId: number, 
        onUpdate: () => void,
    ) {
        const channel = $pusher.subscribe(`project-${projectId}`);
        channel.bind("tasks-updated", onUpdate);

        return channel;
    }

    return {
        updateChannel,
        subscribeToProject,
    };
}