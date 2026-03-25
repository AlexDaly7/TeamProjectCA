<script setup lang="ts">
import type { DateRange } from 'reka-ui';

const props = defineProps<{
    popupTitle?: string,
    popupdescription?: string,
    parentId?: number,
}>();

const emit = defineEmits<{
    (e: 'onAdded'): void,
}>();

const {
    addTask: addTaskHelper
} = useCurrentProject();

const taskName = ref('');
const taskDesc = ref('');
const dateValue = ref<DateRange | undefined>();


async function addTask() {
    // TODO: better validation
    if (
        !taskName.value ||
        !taskDesc.value ||
        !dateValue.value
    ) return;

    if (!dateValue.value.start || !dateValue.value.end) return;

    const result = await addTaskHelper(
        taskName.value,
        taskDesc.value,
        dateValue.value,
        props.parentId
    );

    if (result.error) {
        alert(result.message);
        return;
    } else {
        emit('onAdded');
    }

}
</script>

<template>
    <AppDialog 
        :title="popupTitle ?? 'Add a new task'" 
        :description="popupdescription ?? 'Select a title, description, and date range.'">
        <template #trigger>
            <ButtonSecondary>
                <slot name="trigger" />
            </ButtonSecondary>
        </template>
        <template #body>
            <form 
                class="flex flex-col gap-2" 
                @submit.prevent="addTask()">
                <AppFormInput v-model="taskName" label="Title" name="title" placeholder="My Task" />
                <AppFormInput v-model="taskDesc" label="Description" name="description" placeholder="We need to..." />
                <DatePicker date-picker-label="Timespan" v-model="dateValue" />
                <div class="flex justify-end mt-4">
                    <ButtonPrimary type="submit">
                        <slot name="submit">
                            Create Task
                        </slot>
                    </ButtonPrimary>
                </div>
            </form>
        </template>
    </AppDialog>
</template>