<script setup lang="ts">
import type { TimelineItemWithData, TimelineTaskGroup } from "~/utils/types/timeline";

definePageMeta({
    sidebarType: "project",
});

const { subscribeToProject } = usePusher();
const { currentProjectId } = useCurrentProject();

const {
    data: projectInfo,
    pending: projectInfoPending,
    error: projectInfoError,
    refresh: refreshProjectInfo
} = useFetch(() => `/api/projects/${currentProjectId.value}`, { method: "GET" });

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

// Pusher
// Sub to pusher channel for active project.
watch(currentProjectId, () => {
    const projectIdFromInfo = projectInfo.value?.id;
    if (!projectIdFromInfo) return;

    subscribeToProject(projectIdFromInfo, () => refreshProjectInfo());
}, {
    immediate: true,
});

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
const isDrawerOpen = ref<boolean>(false);
function selectTask(item: TimelineItemWithData) {
    if (item.type === "range") {
        selectedTask.value = item;
        isDrawerOpen.value = true;
    }
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
            <div class="inline-flex justify-between">
                <h1 class="text-3xl font-bold">{{ projectInfo.title }}</h1>
                <ProjectAddDialog>
                    <template #trigger>
                        <ButtonPrimary class="inline-flex items-center gap-1">
                            <Icon name="hugeicons:add-01" />
                            New Task
                        </ButtonPrimary>
                    </template>
                </ProjectAddDialog>
            </div>
            <span class="mt-4">Tasks:</span>
        </div>
    </div>

    <div class="ring-md touch-none">
        <AppGanttFallback
            v-if="projectInfoPending || projectInfoError"
            class="text-txt-secondary text-sm animate-pulse">
            {{ projectInfoPending
                ? 'Loading chart...' 
                : 'There was an error loading the timeline. Please try again' }}
        </AppGanttFallback>

        <AppGanttFallback v-else-if="projectInfo?.tasks.length === 0">
            <span>Looks like there's no added tasks.</span>
            <ProjectAddDialog>
                <template #trigger>
                    <ButtonPrimary>
                        New Task
                    </ButtonPrimary>
                </template>
            </ProjectAddDialog>
        </AppGanttFallback>

        <AppGantt 
            v-else
            :items
            :groupsInfo
            @selected-task="selectTask"/>
    </div>


    <ProjectDrawer 
        v-model:isOpen="isDrawerOpen" 
        :selected-task="selectedTask">
    </ProjectDrawer>
</template>
