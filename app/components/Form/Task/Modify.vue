<script setup lang="ts">
import type { TimelineItemWithData } from '~/utils/types/timeline';
import type { ActionButtonResult } from '~/utils/types/actionButton';
import z from 'zod';
import { VSModifyTask } from '~/utils/schemas/modifyTask';

const props = defineProps<{
    selectedTask: TimelineItemWithData | null
}>();

const { modifyTask } = useCurrentProject();

const validationSchema = VSModifyTask;
type FormValues = z.infer<typeof validationSchema>;

const initialValues = computed(() => {
    if (!props.selectedTask?.data) return undefined;
    
    const { title, description, startTime, endTime, progress, assignees } = props.selectedTask.data;
    
    return {
        title,
        description: description ?? '',
        dateRange: {
            start: new Date(startTime),
            end: new Date(endTime),
        },
        progress: progress ?? 0, 
        assigneeIds: assignees.map((assignee) => assignee.user.id),
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
            progress: values.progress,
            parentId: props.selectedTask.data.parentId,
            assigneeIds: values.assigneeIds,
        });
        
        return { error: false };
    } catch (error) {
        return { 
            error: true, 
            message: error instanceof Error ? error.message : 'Failed to modify task.' 
        };
    }
}

const { members } = useCurrentOrg();

const selectItems = computed(() => {
    const list = (members.value?.members ?? []).map((member) => ({
        value: member.user.id,
        label: member.user.name,
        iconUrl: member.user.image,
    }));

    const pendingText = !members.value ? 'Loading members...' : (members.value.members.length === 0 ? 'No members available' : undefined);

    return {
        list,
        pendingText,
        errorText: undefined,
    }
});
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
            {
                fieldType: 'slider',
                name: 'progress',
                label: 'Progress',
                required: true,
                min: 0,
                max: 1,
                step: 0.01,
            },
            {
                fieldType: 'select-multiple',
                label: 'Assignees',
                name: 'assigneeIds',
                placeholder: 'Select assignees...',
                required: false,
                selectItems,
            }
        ]" />
</template>
