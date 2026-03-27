import type { DateRange } from "reka-ui";
import type { ActionButtonResult } from "~/utils/types/actionButton";
import type { ClientInsertTaskSchema, ClientModifyTaskSchema } from "~~/lib/db/schema";

export const useCurrentProject = () => {
    const route = useRoute();

    const currentProjectId = computed(() => route.params.projectId ? String(route.params.projectId) : null);

    const currentProject = computed(() => {
        if (!currentProjectId.value) return null;
        const parsedId = parseInt(currentProjectId.value);

        return useCurrentOrg().projects.value.find((p) => p.id === parsedId) ?? null;
    });

    async function addTask(title: string, description: string, dateRange: DateRange, parentId?: number): Promise<ActionButtonResult> {
        const { $csrfFetch } = useNuxtApp();
        if (!dateRange.start || !dateRange.end) return { error: true, message: 'No date range start/end.' };

        const startDate = new Date(
            dateRange.start.year,
            dateRange.start.month - 1,
            dateRange.start.day,
        );

        const endDate = new Date(
            dateRange.end.year,
            dateRange.end.month - 1,
            dateRange.end.day,
        );

        // Since parentId is optional, if we don't provide one it doesn't get a parent and
        // won't be a subtask
        const body: ClientInsertTaskSchema = {
            title,
            startTime: startDate,
            endTime: endDate,
            description,
            parentId,
        };

        try {
            await $csrfFetch(`/api/projects/${currentProjectId.value}/tasks`, { method: "POST", body });
            return { error: false };
        } catch (error) {
            console.error('error adding task:', error);
            alert("Failed to add task");
            return { error: true, message: 'Unknown error adding task.' };
        }
    }

    async function modifyTask(taskId: number, data: ClientModifyTaskSchema) {
        const { $csrfFetch } = useNuxtApp();

        try {
            await $csrfFetch(`/api/tasks/${taskId}`, { method: "PATCH", body: data });
        } catch (error) {
            console.error('failed to modify task:', error);
            alert("Failed to modify task");
            return;
        }
    }

    return {
        currentProjectId,
        currentProject,
        addTask,
        modifyTask,
    };
}