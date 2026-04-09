<script setup lang="ts">
import { zodDateRange } from '~~/shared/validation';
import type { TimelineItemWithData } from '~/utils/types/timeline';
import type { ActionButtonResult } from '~/utils/types/actionButton';
import z from 'zod';

const props = defineProps<{
    selectedTask: TimelineItemWithData | null
}>();

const { modifyTask } = useCurrentProject();

// TODO: make this full
const validationSchema = z.object({
    title: z.string('A title is required'),
    description: z.string().optional(),
    dateRange: zodDateRange,
});

type FormValues = z.infer<typeof validationSchema>;

const initialValues = computed(() => {
    if (!props.selectedTask?.data) return undefined;
    
    const { title, description, startTime, endTime } = props.selectedTask.data;
    
    return {
        title,
        description: description ?? '',
        dateRange: {
            start: new Date(startTime),
            end: new Date(endTime),
        },
    } satisfies Partial<FormValues>;
});

async function onSubmit(values: FormValues): Promise<ActionButtonResult> {
    if (!props.selectedTask) {
        return { error: true, message: 'No selected task.' };
    }

    try {
        await modifyTask(props.selectedTask.data.id, {
            title: values.title,
            description: values.description,
            dateRange: values.dateRange,
        });
        
        return { error: false };
    } catch (error) {
        return { 
            error: true, 
            message: error instanceof Error ? error.message : 'Failed to modify task.' 
        };
    }
}
</script>

<template>
    <FormBuilderNew
        :key="selectedTask?.data.id"
        :onSubmit
        :initialValues
        :validationSchema
        :submitBtn="{
            label: 'Save',
            icon: 'hugeicons:floppy-disk',
        }"
        :fields="[
            {
                fieldType: 'text',
                name: 'title',
                label: 'Title',
                placeholder: 'Task Name',
                required: true,
            },
            {
                fieldType: 'text-multiline',
                name: 'description',
                label: 'Description',
                placeholder: 'Enter a description for your task here...',
                required: false,
            },
            {
                fieldType: 'date-range',
                name: 'dateRange',
                label: 'Date Range',
                required: true,
            },
        ]" />
</template>
