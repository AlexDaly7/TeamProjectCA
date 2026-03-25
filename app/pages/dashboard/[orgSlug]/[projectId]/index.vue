<script setup lang="ts">
import type { DateRange } from "reka-ui";

import type { TimelineItemWithData, TimelineTaskGroup } from "~/utils/types/timeline";
import type { ModifyTaskSchema, ClientInsertTaskSchema } from "~~/lib/db/schema";

definePageMeta({
    sidebarType: "project",
});

const { $csrfFetch } = useNuxtApp();
const { subscribeToProject, updateChannel } = usePusher();
const route = useRoute();
const projectId = computed(() => route.params.projectId);

const {
    data: projectInfo,
    pending: projectInfoPending,
    error: projectInfoError,
} = useFetch(() => `/api/projects/${projectId.value}`, { method: "GET" });

// maybe add controls later on
// https://laurens94.github.io/vue-timeline-chart/examples/set-viewport.html#set-viewport-example

const items = computed<TimelineItemWithData[]>(() => {
    if (!projectInfo.value) return [];

    return projectInfo.value.tasks.map((task) => {
        return {
            id: task.id.toString(),
            group: `${task.id}-group`,
            type: "range",
            start: new Date(task.startTime).getTime(),
            end: new Date(task.endTime).getTime(),
            data: task,
        };
    });
});

// TEST
// Pusher

// Sub to pusher channel for active project.
watch(projectId, () => {
    const projectIdFromInfo = projectInfo.value?.id;
    if (!projectIdFromInfo) return;

    subscribeToProject(projectIdFromInfo, (newTasks) => {
        console.log('Received new tasks from pusher', newTasks);
        if (!projectInfo.value) return;

        projectInfo.value.tasks = newTasks;
    });
}, {
    immediate: true,
});

function refreshChannel() {
    const projectIdFromInfo = projectInfo.value?.id;
    if (!projectIdFromInfo) return;

    updateChannel(projectIdFromInfo)
}

// Groups
const groupsInfo = reactive<TimelineTaskGroup[]>([]);
watch(() => projectInfo.value?.tasks, (newTasks) => {
    if (!newTasks) return;

    const incoming = newTasks.map<TimelineTaskGroup>((task) => {
        const existing = groupsInfo.find((g) => g.id === `${task.id}-group`);

        return {
            id: `${task.id}-group`,
            label: task.title,
            expanded: existing?.expanded ?? true,
            parentId: task.parentId,
            cssVariables: { '--item-background': 'transparent' },

            order: task.order,
            depth: task.depth,
            path: task.path,
        };
    })

    // instead of re-assigning groupsInfo, we use this to simultaneously
    // remove all items and add in new ones, causing the chart to catch the
    // update and change accordingly
    groupsInfo.splice(0, groupsInfo.length, ...incoming);
}, {
    immediate: true,
});

// Selected task
const selectedTask = ref<TimelineItemWithData | null>(null);
let taskSelected = ref<boolean>();
function selectTask(item: TimelineItemWithData) {
    if (item.type === "range") {
        selectedTask.value = item;
        taskSelected.value = true;
    }
}

const taskName = ref<string | null>(null);
const taskDesc = ref<string | null>(null);
// TODO: type this
const dateValue = ref<DateRange | undefined>();

async function addTask(subtaskId?: number) {
    // TODO: better validation
    if (
        !taskName.value ||
        !taskDesc.value ||
        !dateValue.value ||
        !projectId.value
    )
        return;
    if (isNaN(Number(projectId.value))) return;

    if (!dateValue.value.start || !dateValue.value.end) return;

    const startDate = new Date(
        dateValue.value.start.year,
        dateValue.value.start.month - 1,
        dateValue.value.start.day,
    );

    const endDate = new Date(
        dateValue.value.end.year,
        dateValue.value.end.month - 1,
        dateValue.value.end.day,
    );

    const body: ClientInsertTaskSchema = {
        title: taskName.value,
        startTime: startDate,
        endTime: endDate,
        description: taskDesc.value,
        parentId: subtaskId,
    };

    try {
        await $csrfFetch(`/api/projects/${projectId.value}/tasks`, { method: "POST", body });
    } catch (error) {
        console.error('error adding task:', error);
        alert("Failed to add task");
        return;
    }

    refreshChannel();
}

async function modifyTask() {
    //copy of addTask could probably be turned into one function
    // TODO: better validation
    if (
        !taskName.value ||
        !taskDesc.value ||
        !dateValue.value ||
        !projectId.value
    )
        return;
    if (isNaN(Number(projectId.value))) return;

    if (!dateValue.value.start || !dateValue.value.end) return;

    if (!selectedTask.value) return;

    const startDate = new Date(
        dateValue.value.start.year,
        dateValue.value.start.month - 1,
        dateValue.value.start.day,
    );

    const endDate = new Date(
        dateValue.value.end.year,
        dateValue.value.end.month - 1,
        dateValue.value.end.day,
    );

    const body: ModifyTaskSchema = {
        title: taskName.value,
        startTime: startDate,
        endTime: endDate,
        description: taskDesc.value,
    };

    try {
        await $csrfFetch(`/api/tasks/${selectedTask.value.data.id}`, { method: "PUT", body });
    } catch (error) {
        console.error('failed to modify task:', error);
        alert("Failed to modify task");
        return;
    }
    
    refreshChannel();
}

async function deleteTask(): Promise<{ error: boolean, message?: string }> {
    if (!selectedTask.value) return { error: true, message: 'No selected task' };
    const taskId = selectedTask.value.data.id;

    try {
        await $csrfFetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    } catch (error) {
        console.error('failed to delete task:', error);
        alert("Failed to delete task");
        return { error: true, message: String(error ?? 'Unknown error deleting task.') };
    }

    refreshChannel();
    return { error: false };
}
</script>

<template>
    <div class="mb-4">
        <div v-if="projectInfoPending">
            <span>Selected project:</span>
            <h1 class="text-3xl font-bold animate-pulse">Loading...</h1>
            <h2 class="mt-4">Tasks:</h2>
        </div>
        <div v-else-if="projectInfoError || !projectInfo">
            There was an error fetching project info. {{ projectInfoError }}
        </div>
        <div v-else class="flex flex-col">
            <span>Selected project:</span>
            <h1 class="text-3xl font-bold">{{ projectInfo.title }}</h1>
            <span class="mt-4">Tasks:</span>
        </div>
    </div>

    <div class="ring-md touch-none">
        <AppGanttFallback
            v-if="projectInfoPending || projectInfoError">
            {{ projectInfoPending
                ? 'Loading chart...' 
                : 'There was an error loading the timeline. Please try again' }}
        </AppGanttFallback>
        <AppGantt 
            v-else
            :items
            :groupsInfo
            @selected-task="selectTask" />
    </div>

    <h2 class="mt-4">Add a new task:</h2>
    <AppDialog 
        title="Add a new task" 
        description="Select a title, description, and date range.">
        <template #trigger>
            <ButtonSecondary> New Task </ButtonSecondary>
        </template>
        <template #body>
            <form 
                class="flex flex-col gap-2" 
                @submit.prevent="addTask()">
                <AppFormInput v-model="taskName" label="Title" name="title" placeholder="My Task" />
                <AppFormInput v-model="taskDesc" label="Description" name="description" placeholder="We need to..." />
                <DatePicker date-picker-label="Timespan" v-model="dateValue" />
                <div class="flex justify-end mt-4">
                    <ButtonPrimary type="submit"> Create Task </ButtonPrimary>
                </div>
            </form>
        </template>
    </AppDialog>
    <ProjectDrawer v-model:isOpen="taskSelected" :selected-task="selectedTask">
        <AppDialog title="Modify a task" description="Select a title, description, and date range.">
            <template #trigger>
                <ButtonSecondary> Modify Task </ButtonSecondary>
            </template>
            <template #body>
                <form class="flex flex-col gap-2" @submit.prevent="modifyTask">
                    <AppFormInput v-model="taskName" label="Title" name="title"
                        :placeholder="selectedTask?.data?.title" />
                    <AppFormInput v-model="taskDesc" label="Description" name="description"
                        :placeholder="selectedTask?.data?.description || 'We need to...'" />
                    <DatePicker date-picker-label="Timespan" v-model="dateValue" />
                    <div class="flex mt-4 max-w-48">
                        <ButtonPrimary type="submit"> Modify Task </ButtonPrimary>
                    </div>
                </form>
            </template>
        </AppDialog>

        <AppActionButton 
            :action="deleteTask"
            description="Are you sure you want to delete this task?"
            :require-are-you-sure="true"
            variant="danger">
            <template #trigger>
                Delete Task
            </template>
        </AppActionButton>

        <div>
            <h2 class="mt-4">Add a new task:</h2>
            <AppDialog title="Add a new sub-task" description="Select a title, description, and date range.">
                <template #trigger>
                    <ButtonSecondary> New Sub-Task </ButtonSecondary>
                </template>
                <template #body>
                    <form class="flex flex-col gap-2" @submit.prevent="addTask(selectedTask?.data.id)">
                        <AppFormInput v-model="taskName" label="Title" name="title" placeholder="My Task" />
                        <AppFormInput v-model="taskDesc" label="Description" name="description"
                            placeholder="We need to..." />
                        <DatePicker date-picker-label="Timespan" v-model="dateValue" />
                        <div class="flex justify-end mt-4">
                            <ButtonPrimary type="submit"> Create Sub-Task </ButtonPrimary>
                        </div>
                    </form>
                </template>
            </AppDialog>
        </div>
    </ProjectDrawer>
</template>
