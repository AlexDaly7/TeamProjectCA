<script setup lang="ts">
import type { DateRange } from 'reka-ui';
import { Timeline, type TimelineGroup, type TimelineItem } from 'vue-timeline-chart';
import "vue-timeline-chart/style.css";
import type { InsertTaskSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();

const route = useRoute();
const projectId = computed(() => route.params.projectId);

const { data: projectInfo, pending: projectInfoPending, error: projectInfoError } = useFetch(() => `/api/project/${projectId.value}`, { method: 'GET' });


const items = ref<TimelineItem[]>([
    {id: "item1", group: "group1", type: "point", start: 1705878000000 },
    {id: "item2", group: "group1", type: "point", start: 1705858000000 }
]);

const groups = ref<TimelineGroup[]>([
    { id:"group1", label: "Group 1"},
    { id:"group2", label: "Group 2"}
]);

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
        renderTask(startDate, endDate, taskName.value, result.id);
    } else {
        alert('Failed to add task');
    }
}

function renderTask(startTime: Date, endTime: Date, groupName: string, groupId: number) {
    groups.value.push({
        id: groupId.toString(),
        label: groupName,
    });

    items.value.push({
        type: "range",
        start: startTime.getTime(),
        end: endTime.getTime(),
        group: groupId.toString(),
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
        <Timeline
            :items
            :groups
            :minViewportDuration="50000000"
            :viewport-min="1740051756"
        />
    </div>

    <h2 class="mt-4">Add a new task:</h2>
    <form
        class="flex flex-col gap-2 bg-slate-800 p-4 max-w-md rounded-lg ring-md"
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
        <AppButton type="submit">
            Create Task
        </AppButton>
    </form>
    
    <!-- debug -->
    <!-- <p>{{ dateValue }}</p> -->
</template>
