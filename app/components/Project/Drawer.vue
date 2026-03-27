<script setup lang="ts">
import type { TimelineItemWithData } from '~/utils/types/timeline';
import { ClientModifyTask, type ClientModifyTaskSchema } from '~~/lib/db/schema';
import z from 'zod';

const props = defineProps<{
    selectedTask: TimelineItemWithData | null
}>()

const { modifyTask } = useCurrentProject();

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

const FormSchema = ClientModifyTask.omit({
    endTime: true,
    startTime: true,
}).extend({
    dateRange: z.object({
        start: z.date(),
        end: z.date(),
    })
});

const { handleSubmit, errors, meta, setErrors, setValues } = useForm({
    validationSchema: toTypedSchema(FormSchema),
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
            startTime: values.dateRange?.start,
            endTime: values.dateRange?.end,
        };

        await modifyTask(props.selectedTask.data.id, payload);
        return { error: false, data: 'printed' };
    }, 
    async (data) => {
        console.log('on success', data);
    }
);
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
                    <div v-else class="px-4 py-2">
                        <span class="text-sm font-medium">Selected task:</span>
                        {{ submitError }}
                        <form class="flex flex-col pt-2" @submit.prevent="onSubmit">
                            <label for="title">
                                <span class="font-medium">Title</span>
                                <AppInput 
                                    name="title"
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
                                    class="min-h-16 py-2"
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
                                <ButtonPrimary 
                                    type="submit" 
                                    :disabled="isLoading">
                                    <LoadingSwap :is-loading="isLoading">
                                        <div class="inline-flex items-center gap-2">
                                            <Icon name="hugeicons:floppy-disk" />
                                            Save
                                        </div>
                                    </LoadingSwap>
                                </ButtonPrimary>
                            </div>
                        </form>

                        <div class="bottom-0 pt-2">
                            <slot></slot>
                        </div>
                    </div>
                </DialogContent>
            </Transition>
        </DialogPortal>
    </DialogRoot>
</template>