<script setup lang="ts">
import type { TimelineItemWithData } from '~/utils/types/timeline';
import { type ClientModifyTaskSchema, ClientModifyTask } from '~~/shared/validation'
import type { ActionButtonResult } from '~/utils/types/actionButton';

const props = defineProps<{
    selectedTask: TimelineItemWithData | null
}>()

const { 
    modifyTask,
    deleteTask: deleteTaskHelper,
    currentProject
} = useCurrentProject();

const isOpen = defineModel('isOpen', { default: false });

watch(isOpen, () => {
    const newTask = props.selectedTask;
    if (!newTask) return;

    setValues({
        title: newTask.data.title,
        description: newTask.data.description ?? '',
        dateRange: {
            start: new Date(newTask.data.startTime),
            end: new Date(newTask.data.endTime),
        },
    });
})

const { handleSubmit, errors, meta, setErrors, setValues } = useForm({
    validationSchema: toTypedSchema(ClientModifyTask),
});

const { isLoading, submitHandler, submitError } = useEditDialogForm({ meta, handleSubmit, setErrors });

const onSubmit = submitHandler(
    async (values) => {
        if (!props.selectedTask) return { error: true, message: 'No selected task.' };

        const payload: ClientModifyTaskSchema = {
            title: values.title,
            description: values.description,
            order: values.order,
            progress: values.progress,
            parentId: values.parentId,
            dateRange: values.dateRange,
        };

        await modifyTask(props.selectedTask.data.id, payload);
        return { error: false, data: 'printed' };
    }, 
    async (data) => {
        console.log('on success', data);
    }
);

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
    <DialogRoot v-model:open="isOpen">
        <DialogPortal>
            <Transition name="drawer-fade">
                <DialogOverlay class="fixed bg-black/50 inset-0" />
            </Transition>
            <Transition name="drawer-slide">
                <DialogContent class="h-full w-sm fixed bottom-0 right-0 bg-main-800 border-l border-main-50/10 rounded-l-lg z-10 focus:outline-none">
                    <VisuallyHidden>
                        <DialogTitle>Opened Task Drawer</DialogTitle>
                        <DialogDescription>Task: {{ selectedTask }}</DialogDescription>
                    </VisuallyHidden>
                    <div 
                        v-if="!selectedTask"
                        class="h-full flex items-center justify-center animate-pulse text-sm font-medium">
                        Loading task...
                    </div>
                    <div v-else class="h-full p-4 flex flex-col">
                        <span class="text-sm font-medium">Selected task:</span>
                        <form class="flex flex-col pt-2" @submit.prevent="onSubmit">
                            <label for="title">
                                <span class="font-medium">Title</span>
                                <AppInput 
                                    name="title"
                                    placeholder="Task Name"
                                    :error="errors['title']"
                                    :disabled="isLoading" />
                                <ErrorMessage 
                                    name="title"
                                    class="text-sm text-danger-txt" />
                            </label>

                            <label for="description">
                                <span class="font-medium">Description</span>
                                <AppInput 
                                    name="description"
                                    class="min-h-32 py-2"
                                    placeholder="Enter a description for your task here..."
                                    as="textarea"
                                    :error="errors['description']"
                                    :disabled="isLoading" />
                                <ErrorMessage 
                                    name="description" 
                                    class="text-sm text-danger-txt" />
                            </label>

                            <label for="dateRange">
                                <span class="font-medium">Date Range</span>
                                <DatePickerField 
                                    name="dateRange"
                                    :error="errors['description']"
                                    :disabled="isLoading" />
                                <ErrorMessage 
                                    name="dateRange" 
                                    class="text-sm text-danger-txt" />
                            </label>

                            <div class="flex justify-end mt-2">
                                <AppButton
                                    type="submit"
                                    :loading="isLoading">
                                    <div class="inline-flex items-center gap-2">
                                        <Icon name="hugeicons:floppy-disk" />
                                        Save
                                    </div>
                                </AppButton>
                            </div>
                        </form>

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
                </DialogContent>
            </Transition>
        </DialogPortal>
    </DialogRoot>
</template>