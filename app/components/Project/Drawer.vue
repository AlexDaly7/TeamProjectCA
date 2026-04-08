<script setup lang="ts">
import type { ActionButtonResult } from '~/utils/types/actionButton';
import type { TimelineItemWithData } from '~/utils/types/timeline';

const props = defineProps<{
    selectedTask: TimelineItemWithData | null
}>()

const {
    currentProject,
    deleteTask: deleteTaskHelper,
} = useCurrentProject();

const isOpen = defineModel('isOpen', { default: false });

async function deleteTask(): Promise<ActionButtonResult> {
    if (!props.selectedTask) return { error: true, message: 'No selected task.' };

    try {
        await deleteTaskHelper(props.selectedTask.data.id);
        isOpen.value = false;
        return { error: false };
    } catch (error) {
        return { error: true, message: 'Unknown error deleting task.' };
    }
}
</script>

<template>
    <AppDrawer
        accessible-title="Opened Task Drawer"
        :accessible-description="`Task: ${selectedTask?.id}`"
        v-model="isOpen">
        <div 
            v-if="!selectedTask"
            class="h-full flex items-center justify-center animate-pulse text-sm font-medium">
            Loading task...
        </div>
        <div v-else class="h-full p-4 flex flex-col">
            <span class="text-sm font-medium">Selected task:</span>
            <FormTaskModify :selected-task="selectedTask" />

            <div class="h-0.5 w-full bg-main-50/10 my-4"></div>
            <AppButton
                v-if="!currentProject"
                variant="secondary"
                :loading="true">
                Loading...
            </AppButton>
            <AppButton
                v-else
                variant="secondary"
                class="inline-flex gap-1 items-center justify-center"
                :href="`https://github.com/${currentProject.repoOwner}/${currentProject.repoName}/issues/${selectedTask.data.ghIssueNumber}`">
                <Icon name="hugeicons:github-01" />
                View on GitHub ↗
            </AppButton>

            <div class="flex flex-col gap-2 mt-auto">
                <ProjectAddDialog 
                    popup-title="Add a new sub-task"
                    :parent-id="selectedTask.data.id">
                    <template #trigger>
                        <AppButton variant="secondary">
                            New Sub-Task
                        </AppButton>
                    </template>
                    <template #submit>
                        Create sub-task
                    </template>
                </ProjectAddDialog>

                <AppActionButton 
                    :action="deleteTask"
                    description="Are you sure you want to delete this task?"
                    :require-are-you-sure="true"
                    variant="danger">
                    <template #trigger>
                        Delete Task
                    </template>
                </AppActionButton>
            </div>
        </div>
    </AppDrawer>
</template>