// Recursive date serializer so types Nuxt API responses.
// - if `T` is a date, type is string
// - else if `T` is a list of type `U`, return a list of each item `U` ran through the serializer
// - else if `T` is an object, for every key `K` in object `T`, run the serializer on key `K`

import type { TasksWithDepth } from "~~/lib/db/queries/tasks";

//   of object `T`, and return each key:serialized value pair as a new object.
type SerializeDates<T> =
    T extends Date
        ? string
        : T extends Array<infer U>
            ? SerializeDates<U>[]
            : T extends object
                ? { [ K in keyof T ]: SerializeDates<T[K]> }
                : T;

export const usePusher = () => {
    const { $pusher, $csrfFetch } = useNuxtApp();

    async function updateChannel(projectId: number) {
        // TODO Change method
        console.log('triggering channel update', projectId)
        $csrfFetch(`/api/projects/update/${projectId}`, { method: "POST" });
    }

    function subscribeToProject(
        projectId: number, 
        onUpdate: (data: SerializeDates<TasksWithDepth>) => void,
    ) {
        const channel = $pusher.subscribe(`project-${projectId}`);
        channel.bind("project-updated", onUpdate);

        return channel;
    }

    return {
        updateChannel,
        subscribeToProject,
    };
}