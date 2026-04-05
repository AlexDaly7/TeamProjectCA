<script setup lang="ts">
import type { DateRange } from 'reka-ui';

const props = defineProps<{
    popupTitle?: string,
    popupdescription?: string,
    parentId?: number,
}>();

const {
    addTask: addTaskHelper
} = useCurrentProject();

const taskName = ref('');
const taskDesc = ref('');
const dateValue = ref<DateRange | undefined>();

const isOpen = ref(false);
const isLoading = ref(false);

async function addTask() {
    // TODO: better validation
    if (
        !taskName.value ||
        !taskDesc.value ||
        !dateValue.value
    ) return;

    if (!dateValue.value.start || !dateValue.value.end) return;

    isLoading.value = true;
    const result = await addTaskHelper(
        taskName.value,
        taskDesc.value,
        dateValue.value,
        props.parentId
    );

    if (result.error) {
        alert(result.message);
        isLoading.value = false;
        return;
    }

    isOpen.value = false;
    isLoading.value = false;
}
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
            <form 
                class="flex flex-col gap-2" 
                @submit.prevent="addTask()">
                <AppFormInput v-model="taskName" label="Title" name="title" placeholder="My Task" />
                <AppFormInput v-model="taskDesc" label="Description" name="description" placeholder="We need to..." />
                <Label class="flex flex-col gap-2">
                    <span 
                        class="text-sm text-txt-secondary">
                        Timespan
                    </span>
                    <DatePicker v-model="dateValue" />
                </Label>
                <div class="flex justify-end mt-4">
                    <AppButton 
                        type="submit" 
                        :loading="isLoading">
                        <slot name="submit">
                            Create Task
                        </slot>
                    </AppButton>
                </div>
            </form>
        </template>
    </AppDialog>
</template>