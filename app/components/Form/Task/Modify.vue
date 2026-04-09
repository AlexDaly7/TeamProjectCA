<script setup lang="ts">
import { ClientModifyTask, type ClientModifyTaskSchema } from '~~/shared/validation';
import type { TimelineItemWithData } from '~/utils/types/timeline';

const props = defineProps<{
    selectedTask: TimelineItemWithData | null
}>();

const { modifyTask } = useCurrentProject();


const { handleSubmit, errors, meta, setErrors, setValues } = useForm({
    validationSchema: toTypedSchema(ClientModifyTask),
});

const { isLoading, submitHandler } = useEditDialogForm({ meta, handleSubmit, setErrors });

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

// When selected task changes, update form values
watch(
    () => props.selectedTask, 
    (newTask) => {
    if (!newTask?.data) return;

    const { title, description, startTime, endTime } = newTask.data;

    setValues({
        title,
        description: description ?? '',
        dateRange: {
            start: new Date(startTime),
            end: new Date(endTime),
        },
    });
}, { immediate: true });

</script>

<template>
    <form 
        class="flex flex-col pt-2" 
        @submit.prevent="onSubmit">
        <label for="title">
            <span class="font-medium">Title</span>
            <FormBuilderInputRaw 
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
            <FormBuilderInputRaw 
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
</template>