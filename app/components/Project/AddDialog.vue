<script setup lang="ts">
import type z from 'zod';
import { VSModifyTask } from '~/utils/schemas/modifyTask';
import type { ActionButtonResult } from '~/utils/types/actionButton';

const props = defineProps<{
    popupTitle?: string;
    popupdescription?: string;
    parentId?: number;
}>();

const { addTask: addTaskHelper } = useCurrentProject();

const { members } = useCurrentOrg();

const isOpen = ref(false);

const validationSchema = VSModifyTask;
type FormValues = z.infer<typeof validationSchema>;

async function onSubmit(values: FormValues): Promise<ActionButtonResult> {
    const result = await addTaskHelper(
        values.title,
        values.description,
        values.dateRange,
        values.progress,
        props.parentId,
        values.assigneeIds,
    );

    if (result.error) {
        return { error: true, message: result.message ?? 'Unknown error.' };
    }

    isOpen.value = false;
    return { error: false };
}

const selectItems = computed(() => {
    const list = (members.value?.members ?? []).map((member) => ({
        value: member.user.id,
        label: member.user.name,
        iconUrl: member.user.image,
    }));

    const pendingText = !members.value
        ? 'Loading members...'
        : members.value.members.length === 0
          ? 'No members available'
          : undefined;

    return {
        list,
        pendingText,
        errorText: undefined,
    };
});
</script>

<template>
    <AppDialog
        v-model:is-open="isOpen"
        :title="popupTitle ?? 'Add a new task'"
        :description="popupdescription ?? 'Select a title, description, and date range.'">
        <template #trigger>
            <slot name="trigger" />
        </template>
        <template #body>
            <FormBuilderNew
                @submit="onSubmit"
                :validationSchema
                :submit-btn="{
                    label: 'Create Task',
                }"
                :fields="[
                    {
                        fieldType: 'text',
                        label: 'Title',
                        name: 'title',
                        placeholder: 'My Task',
                        required: true,
                    },
                    {
                        fieldType: 'text-multiline',
                        label: 'Description',
                        name: 'description',
                        placeholder: 'We need to...',
                        required: false,
                    },
                    {
                        fieldType: 'date-range',
                        label: 'Timespan',
                        name: 'dateRange',
                        required: true,
                    },
                    {
                        fieldType: 'slider',
                        label: 'Initial Progress',
                        name: 'progress',
                        required: false,
                        max: 1,
                        min: 0,
                        step: 0.01,
                    },
                    {
                        fieldType: 'select-multiple',
                        label: 'Assignees',
                        name: 'assigneeIds',
                        placeholder: 'Select assignees...',
                        required: false,
                        selectItems,
                    },
                ]" />
        </template>
    </AppDialog>
</template>
