<script setup lang="ts">
import type { DateRange } from 'reka-ui';
import { Timeline, type TimelineGroup, type TimelineItem } from 'vue-timeline-chart';
import "vue-timeline-chart/style.css";
import type { InsertTaskSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();

const route = useRoute();
const projectId = computed(() => route.params.projectId);

const { data: projectInfo, pending: projectInfoPending, error: projectInfoError } = useFetch(() => `/api/project/${projectId.value}`, { method: 'GET' });

const { data: tasksInfo, pending: tasksPending, error: tasksError } = useFetch(() => `/api/tasks/${projectId.value}`, { method: 'GET' });

// maybe add controls later on
// https://laurens94.github.io/vue-timeline-chart/examples/set-viewport.html#set-viewport-example

const items = computed<TimelineItem[]>(() => {
    if (!tasksInfo.value) return [];
    
    return tasksInfo.value.map((task) => {
        return {
            id: task.id.toString(),
            group: `${task.id}-group`,
            type: 'range',
            start: new Date(task.startTime).getTime(),
            end: new Date(task.endTime).getTime()
        }
    })
});

// How much time to put on the timeline as padding before the start of the ealiest task
// and end of the latest task
const PADDING_MS = 604800000;

const bounds = computed<{ lower: number, upper: number }>(() => {
    // 1 month behind, 1 month ahead as default view range
    const defaultValues = {
        lower: Date.now() - 2629800000,
        upper: Date.now() + 2629800000
    };

    if (!items.value || !items.value[0]) return defaultValues;

    const lowest = items.value.reduce((lowest, item) => item.start < lowest.start ? item : lowest, items.value[0]);
    const highest = items.value.reduce((highest, item) => item.start > highest.start ? item : highest, items.value[0]);
    
    return {
        lower: lowest.start - PADDING_MS,
        upper: (highest.end ?? defaultValues.upper) + PADDING_MS,
    };
});

const groups = computed<TimelineGroup[]>(() => {
    if (!tasksInfo.value) return [];

    return tasksInfo.value.map((task) => {
        return {
            id: `${task.id}-group`,
            label: task.title,
        }
    })
});

const taskName = ref<string | null>(null);
const taskDesc = ref<string | null>(null);
// TODO: type this
const dateValue = ref<DateRange | undefined>();

// function createTimeObj() {
//     const date1 = dateValue.value.start;
//     const date2 = dateValue.value.end;
//     const time1 = new Date(date1.year, date1.month-1, date1.day, date1.hour);
//     const time2 = new Date(date2.year, date2.month-1, date2.day, date2.hour);
//     console.log(time1.getTime());
//     items.value.push({id: "item"+(items.value.length+1), group: "group1", type: "range", start: (time1.getTime()), end: (time2.getTime())});
//     console.log(items);
// }

async function addTask() {
    // TODO: better validation
    if (!taskName.value || !taskDesc.value || !dateValue.value || !projectId.value) return;
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

    const body: InsertTaskSchema = {
        title: taskName.value,
        projectId: Number(projectId.value.toString()),
        startTime: startDate,
        endTime: endDate,
        description: taskDesc.value,
    };

    const result = await $csrfFetch(`/api/tasks`, { method: "POST", body });

    if (result.id) {
        // TODO: fix this not refreshing
        renderTask(startDate, endDate, taskName.value, result.id);
    } else {
        alert('Failed to add task');
    }
}

function renderTask(startTime: Date, endTime: Date, groupName: string, taskId: number) {
    groups.value.push({
        id: taskId.toString(),
        label: groupName,
    });

    items.value.push({
        type: "range",
        start: startTime.getTime(),
        end: endTime.getTime(),
        group: taskId.toString(),
    });
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

    
    <div class="ring-md rounded-sm touch-none">
        <div v-if="tasksPending">
            Loading timeline...
        </div>
        <div v-else-if="tasksError">
            There was an error loading the timeline
        </div>
        <Timeline
            v-else
            :items
            :groups
            :initial-viewport-start="bounds.lower"
            :initial-viewport-end="bounds.upper"
            />
    </div>

    <h2 class="mt-4">Add a new task:</h2>
    <AppDialog
        title="Add a new task"
        description="Select a title, description, and date range.">
        <template #trigger>
            <AppButton>
                New Task
            </AppButton>
        </template>
        <template #body>
            <form
                class="flex flex-col gap-2"
                @submit.prevent="addTask">
                <AppFormInput
                    v-model="taskName"
                    label="Title"
                    name="title"
                    placeholder="My Task" />
                <AppFormInput
                    v-model="taskDesc"
                    label="Description"
                    name="description"
                    placeholder="We need to..." />
                <DatePicker 
                    date-picker-label="Timespan"
                    v-model="dateValue"/>
                <div class="flex items-end mt-4">
                    <button 
                        type="submit"
                        class="ml-auto bg-main-100 text-main-900 px-6 py-2 rounded-md ring-md cursor-pointer hover:bg-main-500 transition-all duration-75 hover:scale-102 active:scale-98">
                        Create Task
                    </button>
                </div>
            </form>
        </template>
    </AppDialog>
</template>
