import type { z } from 'zod';
import type { ActionButtonResult } from '~/utils/types/actionButton';
import type { ClientModifyTaskSchema, ClientInsertTaskSchema, zodDateRange } from '~~/shared/validation';

export const useCurrentProject = () => {
    const route = useRoute();

    const currentProjectId = computed(() => (route.params.projectId ? String(route.params.projectId) : null));

    const currentProject = computed(() => {
        if (!currentProjectId.value) return null;
        const parsedId = parseInt(currentProjectId.value);

        return useCurrentOrg().projects.value.find((p) => p.id === parsedId) ?? null;
    });

    async function addTask(
        title: string,
        description: string | undefined,
        dateRange: z.infer<typeof zodDateRange>,
        parentId?: number,
    ): Promise<ActionButtonResult> {
        const { $csrfFetch } = useNuxtApp();
        if (!dateRange.start || !dateRange.end) return { error: true, message: 'No date range start/end.' };

        // Since parentId is optional, if we don't provide one it doesn't get a parent and
        // won't be a subtask
        const body: ClientInsertTaskSchema = {
            title,
            dateRange,
            description,
            parentId,
        };

        try {
            await $csrfFetch(`/api/projects/${currentProjectId.value}/tasks`, {
                method: 'POST',
                body,
            });
            return { error: false };
        } catch (error) {
            console.error('error adding task:', error);
            alert('Failed to add task');
            return { error: true, message: 'Unknown error adding task.' };
        }
    }

    async function modifyTask(taskId: number, data: ClientModifyTaskSchema) {
        const { $csrfFetch } = useNuxtApp();

        try {
            await $csrfFetch(`/api/tasks/${taskId}`, { method: 'PATCH', body: data });
        } catch (error) {
            console.error('failed to modify task:', error);
            alert('Failed to modify task');
            return;
        }
    }

    async function deleteTask(taskId: number): Promise<{ error: boolean; message?: string }> {
        const { $csrfFetch } = useNuxtApp();

        try {
            await $csrfFetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        } catch (error) {
            console.error('failed to delete task:', error);
            alert('Failed to delete task');
            return {
                error: true,
                message: String(error ?? 'Unknown error deleting task.'),
            };
        }

        return { error: false };
    }

    return {
        currentProjectId,
        currentProject,
        addTask,
        modifyTask,
        deleteTask,
    };
};
