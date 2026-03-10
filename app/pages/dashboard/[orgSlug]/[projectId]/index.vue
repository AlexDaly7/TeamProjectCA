<script setup lang="ts">
import type { DateRange } from "reka-ui";
import {
    Timeline,
    type TimelineGroup,
    type TimelineItem,
    type TimelineMarker,
} from "vue-timeline-chart";
import "vue-timeline-chart/style.css";
import {
    tasks,
    type InsertTaskSchema,
    type ModifyTaskSchema,
    type DeleteTaskSchema,
} from "~~/lib/db/schema";
import Pusher from "pusher-js";
import type { ApiResponse } from "~/composables/apiResponse";

definePageMeta({
    sidebarType: "project",
});

const { $csrfFetch } = useNuxtApp();

const route = useRoute();
const projectId = computed(() => route.params.projectId);

const {
    data: projectInfo,
    pending: projectInfoPending,
    error: projectInfoError,
} = useFetch(() => `/api/project/${projectId.value}`, { method: "GET" });
console.log(projectId.value);
const {
    data: tasksInfo,
    pending: tasksPending,
    error: tasksError,
    refresh: taskRefresh,
} = useFetch(() => `/api/task/${projectId.value}`, { method: "GET" });

// maybe add controls later on
// https://laurens94.github.io/vue-timeline-chart/examples/set-viewport.html#set-viewport-example

const items = computed<TimelineItemWithData[]>(() => {
    if (!tasksInfo.value) return [];

    return tasksInfo.value.map((task) => {
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
const pusher = new Pusher("e41e7620d6ab296d33aa", {
    cluster: "eu",
});

Pusher.logToConsole = true;

if (projectInfo.value) {
    var channel = pusher.subscribe("project" + projectInfo.value.id);
    channel.bind("update", taskRefresh);
}

async function updateChannel() {
    if (projectInfo.value) {
        const result = $csrfFetch(`/api/projects/update/` + projectInfo.value.id, {
            method: "POST",
            body: {
                orgId: projectInfo.value.organizationId,
            }
        });
    }
}

// How much time to put on the timeline as padding before the start of the earliest task
// and end of the latest task
const PADDING_MS = 604800000;

const bounds = computed<{ lower: number; upper: number }>(() => {
    // 1 month behind, 1 month ahead as default view range
    const defaultValues = {
        lower: Date.now() - 2629800000,
        upper: Date.now() + 2629800000,
    };

    if (!items.value || !items.value[0]) return defaultValues;

    const lowest = items.value.reduce(
        (lowest, item) => (item.start < lowest.start ? item : lowest),
        items.value[0],
    );
    const highest = items.value.reduce(
        (highest, item) => (item.start > highest.start ? item : highest),
        items.value[0],
    );

    return {
        lower: lowest.start - PADDING_MS,
        upper: (highest.end ?? defaultValues.upper) + PADDING_MS,
    };
});

const groupsInfo = reactive<TimelineTaskGroup[]>([]);
tasksInfo?.value?.forEach((task) => {
    let visible = true;
    if(task.parentId!==null) visible=false;
    groupsInfo.push({
        id: `${task.id}-group`,
        label: task.title,
        visible: visible,
        parentId: task.parentId,
    });
});

const groups = computed<TimelineGroup[]>(() => {
    if (!tasksInfo.value) return [];

    //return tasksInfo.value
    //.filter(task => task.parentId==null)
    //.map((task): TimelineGroup => {
    //    return {
    //        id: `${task.id}-group`,
    //        label: task.title,
    //    };
    //});
    return groupsInfo
    .filter(group => group.visible==true)
    .map((group): TimelineGroup =>{
        return {
            id: group.id,
            label: group.label,
        };
    });
});

type TimelineTaskGroup = TimelineGroup & {
    visible: boolean,
    parentId: number | null,
};



const selectedTask = ref<TimelineItemWithData | null>(null);
type TimelineItemWithData = TimelineItem & {
    data: ApiResponse<"/api/task/:projectId", "get">[number];
};

function taskSelect({
    time,
    event,
    item,
}: {
    time: number;
    event: MouseEvent;
    item: TimelineMarker | TimelineItemWithData;
}) {
    if (item && event.type === "click" && item.type === "range") {
        selectedTask.value = item;
        console.log(selectedTask);
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

    const body: InsertTaskSchema = {
        title: taskName.value,
        projectId: Number(projectId.value.toString()),
        startTime: startDate,
        endTime: endDate,
        description: taskDesc.value,
        parentId: subtaskId,
    };

    const result = await $csrfFetch(`/api/tasks`, { method: "POST", body });

    if (result.id) {
        // TODO: fix this not refreshing
        renderTask(startDate, endDate, taskName.value, result.id);
    } else {
        alert("Failed to add task");
    }
    updateChannel();
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
        projectId: Number(projectId.value.toString()),
        id: selectedTask.value.data.id,
        startTime: startDate,
        endTime: endDate,
        description: taskDesc.value,
    };

    const result = await $csrfFetch(`/api/tasks`, { method: "PUT", body });

    if (result.id) {
        // TODO: fix this not refreshing
        renderTask(startDate, endDate, taskName.value, result.id);
        updateChannel();
    } else {
        alert("Failed to modify task");
    }
}

async function deleteTask() {
    if (!selectedTask.value) return;

    const body: DeleteTaskSchema = {
        id: selectedTask.value.data.id,
    };

    const result = await $csrfFetch(`/api/tasks`, { method: "DELETE", body });

    console.log(result);

    if (result.id) {
        taskRefresh();
        updateChannel();
    } else {
        alert("Failed to delete task");
    }
}

function renderTask(
    startTime: Date,
    endTime: Date,
    groupName: string,
    taskId: number,
) {
    // TODO check whether sub-task or not and decide on how to render.
    // Could also stop function from being called entirely.
    groups.value.push({
        id: taskId.toString(),
        label: groupName,
    });
    taskRefresh();
}

function renderSubTask(taskTitle: string | undefined) {
    if(!tasksInfo.value||taskTitle===undefined) return;
    const task = tasksInfo.value.find(task => task.title===taskTitle);
    if(!task || !task.id) return;

    let subTasks = groupsInfo.filter(group => group.parentId == task.id);
    subTasks.forEach((group)=>{
        group.visible = true;
    });
    
    let visible = groupsInfo.find(group => group.label===taskTitle)?.visible;
    visible = true;
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
        <div v-if="tasksPending">Loading timeline...</div>
        <div v-else-if="tasksError">There was an error loading the timeline</div>
        <Timeline v-else :items :groups :initial-viewport-start="bounds.lower" :initial-viewport-end="bounds.upper"
            @click="taskSelect">
            <template #group-label="{ group }">
                <form @submit.prevent="renderSubTask(group.label)">
                    <ButtonPrimary type="submit">
                        Drop
                    </ButtonPrimary>
                    {{ group.label }}
                </form>
            </template>
        </Timeline>
    </div>

    <h2 class="mt-4">Add a new task:</h2>
    <AppDialog title="Add a new task" description="Select a title, description, and date range.">
        <template #trigger>
            <ButtonSecondary> New Task </ButtonSecondary>
        </template>
        <template #body>
            <form class="flex flex-col gap-2" @submit.prevent="addTask()">
                <AppFormInput v-model="taskName" label="Title" name="title" placeholder="My Task" />
                <AppFormInput v-model="taskDesc" label="Description" name="description" placeholder="We need to..." />
                <DatePicker date-picker-label="Timespan" v-model="dateValue" />
                <div class="flex justify-end mt-4">
                    <ButtonPrimary type="submit"> Create Task </ButtonPrimary>
                </div>
            </form>
        </template>
    </AppDialog>
    <div v-if="selectedTask" class="mt-4">
        <h2>{{ selectedTask.data.title }}</h2>
        <p>{{ selectedTask.data.description }}</p>
        <AppDialog title="Modify a task" description="Select a title, description, and date range.">
            <template #trigger>
                <ButtonSecondary> Modify Task </ButtonSecondary>
            </template>
            <template #body>
                <form class="flex flex-col gap-2" @submit.prevent="modifyTask">
                    <AppFormInput v-model="taskName" label="Title" name="title" placeholder="My Task" />
                    <AppFormInput v-model="taskDesc" label="Description" name="description"
                        placeholder="We need to..." />
                    <DatePicker date-picker-label="Timespan" v-model="dateValue" />
                    <div class="flex justify-end mt-4">
                        <ButtonPrimary type="submit"> Modify Task </ButtonPrimary>
                    </div>
                </form>
            </template>
        </AppDialog>

        <AppDialog title="Delete task" description="Are you sure you want to delete this task?">
            <template #trigger>
                <ButtonSecondary> Delete Task </ButtonSecondary>
            </template>
            <template #body>
                <form class="flex flex-col gap-2" @submit.prevent="deleteTask">
                    <div class="flex justify-end mt-4">
                        <ButtonPrimary type="submit"> Delete Task </ButtonPrimary>
                    </div>
                </form>
            </template>
        </AppDialog>
        <div v-if="(selectedTask.data.depth<=3)||(selectedTask.data.depth===0)">
            <h2 class="mt-4">Add a new task:</h2>
            <AppDialog title="Add a new sub-task" description="Select a title, description, and date range.">
                <template #trigger>
                    <ButtonSecondary> New Sub-Task </ButtonSecondary>
                </template>
                <template #body>
                    <form class="flex flex-col gap-2" @submit.prevent="addTask(selectedTask.data.id)">
                        <AppFormInput v-model="taskName" label="Title" name="title" placeholder="My Task" />
                        <AppFormInput v-model="taskDesc" label="Description" name="description" placeholder="We need to..." />
                        <DatePicker date-picker-label="Timespan" v-model="dateValue" />
                        <div class="flex justify-end mt-4">
                            <ButtonPrimary type="submit"> Create Sub-Task </ButtonPrimary>
                        </div>
                    </form>
                </template>
            </AppDialog>
        </div>
    </div>
</template>
