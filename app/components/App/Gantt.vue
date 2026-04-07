<script setup lang="ts">
import { onMounted } from 'vue';
import { Timeline } from 'vue-timeline-chart';
import "vue-timeline-chart/style.css";

import type { TimelineItemWithData, TimelineTaskGroup } from '~/utils/types/timeline';

const props = defineProps<{
    items: TimelineItemWithData[],
    groupsInfo: TimelineTaskGroup[], // all including hidden
}>();

defineEmits<{
    (e: 'selectedTask', item: TimelineItemWithData): void,
}>();

// Get width of main timeline element
let timelineWidth = ref<number>(1096);
onMounted(async () => {
    await nextTick();
    window.addEventListener("resize", () => {
        getTimelineWidth();
    });
    getTimelineWidth();
});

function getTimelineWidth() {
    const timelineElement = document.getElementById("timelineElement");
    if (timelineElement) {
        timelineWidth.value = timelineElement.getBoundingClientRect().width;
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

    if (!props.items || !props.items[0]) return defaultValues;

    const lowest = props.items.reduce(
        (lowest, item) => (item.start < lowest.start ? item : lowest),
        props.items[0],
    );
    const highest = props.items.reduce(
        (highest, item) => (item.start > highest.start ? item : highest),
        props.items[0],
    );

    return {
        lower: lowest.start - PADDING_MS,
        upper: (highest.end ?? defaultValues.upper) + PADDING_MS,
    };
});

function toggleExpanded(groupId: string) {
    const group = props.groupsInfo.find(g => g.id === groupId);
    if (group) group.expanded = !group.expanded;
}

function hasChildren(groupId: string): boolean {
    const taskId = Number(groupId.replace('-group', ''));

    return props.groupsInfo.some(g => g.parentId === taskId);
}


function isGroupVisible(group: TimelineTaskGroup): boolean {
    if (group.depth === 0) return true;

    return group.path.slice(0, -1).every((ancestorId) => {
        const ancestor = props.groupsInfo.find(g => g.id === `${ancestorId}-group`);
        return ancestor?.expanded === true;
    });
}

const groups = computed<TimelineTaskGroup[]>(() => {
    // Only show if ancestor expanded
    return props.groupsInfo.filter(isGroupVisible);
});

let timelineStart = ref<number>(bounds.value.lower);
let timelineEnd = ref<number>(bounds.value.upper);

const lines = computed(() => {
    let spacing = 0;
    const end = timelineEnd.value - timelineStart.value;
    const linesArr = groups.value.map((group) => {
        const item = props.items.find((task) => task.id + "-group" == group.id);
        const itemStart = item?.start;
        const itemEnd = item?.end;
        let svgData = {
            svgPath: ``,
            colour: "cyan",
        }

        if (itemStart && itemEnd) {
            // Gets the starting position in pixels from the current timeline viewport range and the timelines width in pixels
            const linePosX = ((itemStart - timelineStart.value) / end) * timelineWidth?.value;
            const child = props.items.find((task) => task.data.parentId + "-group" == group.id);

            if (group.expanded) { // If expanded
                if (child != undefined) { // If child, draw path to child (Antonio's note to self a child cannot be longer than its parent and thus start before its parent)
                    const childPosX = (((child.start - timelineStart.value) / end)) * timelineWidth?.value;
                    //take the line 10px behind the furthest back item
                    if (childPosX < linePosX) {
                        svgData.svgPath = `M${linePosX} ${spacing + 70} L${childPosX - 10} ${spacing + 70} L${childPosX - 10} ${(spacing) + 120} L${childPosX} ${(spacing) + 120}`;
                    }
                    else {
                        svgData.svgPath = `M${linePosX} ${spacing + 70} L${linePosX - 10} ${spacing + 70} L${linePosX - 10} ${(spacing) + 120} L${childPosX} ${(spacing) + 120}`;
                    }
                } else { // If no child, check for items sibling
                    const sibling = getItemSibling(item);
                    if (sibling != null) { // If sibling draw line to sibling
                        const siblingPosX = (((sibling.start - timelineStart.value) / end)) * timelineWidth?.value;
                        //take the line 10px behind the furthest back item
                        if (siblingPosX < linePosX) {
                            svgData.svgPath = `M${linePosX} ${spacing + 70} L${siblingPosX - 10} ${spacing + 70} L${siblingPosX - 10} ${(spacing) + 120} L${siblingPosX} ${(spacing) + 120}`;
                        }
                        else {
                            svgData.svgPath = `M${linePosX} ${spacing + 70} L${linePosX - 10} ${spacing + 70} L${linePosX - 10} ${(spacing) + 120} L${siblingPosX} ${(spacing) + 120}`;
                        }
                    } else { // If not sibling
                        let parent = props.items.find((task) => task.data.id == item.data.parentId); // Get items parent
                        if (parent != null) { // If parent
                            const siblingParent = getItemSibling(parent); // Get items parents sibling
                            if (siblingParent != null) { // If items parents sibling, draw line to it
                                const siblingParentPosX = (((siblingParent.start - timelineStart.value) / end)) * timelineWidth?.value;
                                //take the line 10px behind the furthest back item
                                if (siblingParentPosX < linePosX) {
                                    svgData.svgPath = `M${linePosX} ${spacing + 70} L${siblingParentPosX - 10} ${spacing + 70} L${siblingParentPosX - 10} ${(spacing) + 120} L${siblingParentPosX} ${(spacing) + 120}`;
                                }
                                else {
                                    svgData.svgPath = `M${linePosX} ${spacing + 70} L${linePosX - 10} ${spacing + 70} L${linePosX - 10} ${(spacing) + 120} L${siblingParentPosX} ${(spacing) + 120}`;
                                }
                            } else { // Else if no items parents sibling, item is a sub sub task. Draw line to parents parents sibling
                                parent = props.items.find((task) => task.data.id == parent?.data.parentId);
                                if (!parent) { return svgData; };
                                const siblingParent = getItemSibling(parent);
                                if (!siblingParent) { return svgData; };
                                const siblingParentPosX = (((siblingParent.start - timelineStart.value) / end)) * timelineWidth?.value;
                                //take the line 10px behind the furthest back item
                                if (siblingParentPosX < linePosX) {
                                    svgData.svgPath = `M${linePosX} ${spacing + 70} L${siblingParentPosX - 10} ${spacing + 70} L${siblingParentPosX - 10} ${(spacing) + 120} L${siblingParentPosX} ${(spacing) + 120}`;
                                }
                                else {
                                    svgData.svgPath = `M${linePosX} ${spacing + 70} L${linePosX - 10} ${spacing + 70} L${linePosX - 10} ${(spacing) + 120} L${siblingParentPosX} ${(spacing) + 120}`;
                                }
                            }
                        } else { // If no parent, return nothing
                            return svgData;
                        }

                    }
                }
            } else { // If task is expanded
                const sibling = getItemSibling(item);
                if (sibling != null) { // If sibling, draw line to sibling
                    const siblingPosX = (((sibling.start - timelineStart.value) / end)) * timelineWidth?.value;
                    //take the line 10px behind the furthest back item
                    if (siblingPosX < linePosX) {
                        svgData.svgPath = `M${linePosX} ${spacing + 70} L${siblingPosX - 10} ${spacing + 70} L${siblingPosX - 10} ${(spacing) + 120} L${siblingPosX} ${(spacing) + 120}`;
                    }
                    else {
                        svgData.svgPath = `M${linePosX} ${spacing + 70} L${linePosX - 10} ${spacing + 70} L${linePosX - 10} ${(spacing) + 120} L${siblingPosX} ${(spacing) + 120}`;
                    }
                } else { // If no sibling, get items parent 
                    let parent = props.items.find((task) => task.data.id == item.data.parentId);
                    if (parent != null) { // If parent, get parents sibling
                        const siblingParent = getItemSibling(parent);
                        if (siblingParent != null) { // If items parents sibling, draw line to it
                            const siblingParentPosX = (((siblingParent.start - timelineStart.value) / end)) * timelineWidth?.value;
                            //take the line 10px behind the furthest back item
                            if (siblingParentPosX < linePosX) {
                                svgData.svgPath = `M${linePosX} ${spacing + 70} L${siblingParentPosX - 10} ${spacing + 70} L${siblingParentPosX - 10} ${(spacing) + 120} L${siblingParentPosX} ${(spacing) + 120}`;
                            }
                            else {
                                svgData.svgPath = `M${linePosX} ${spacing + 70} L${linePosX - 10} ${spacing + 70} L${linePosX - 10} ${(spacing) + 120} L${siblingParentPosX} ${(spacing) + 120}`;
                            }
                        } else { // Return nothing
                            return svgData;
                        }
                    } else { // If no parent, draw nothing.
                        return svgData;
                    }
                }
            }
            // Increases spacing by height of group
            if (props.items.find((task) => task.data.parentId == item.data.id) == null) {
                spacing += 63.35;
            } else {
                spacing += 60.95;
            }
        }
        return svgData;
    });

    return { linesArr, spacing };
});

function getItemSibling(item: TimelineItemWithData) {
    let i = props.items.indexOf(item);
    console.log("I: " + i + "\nLength: " + props.items.length + "\nITEM TITLE: " + item.data.title);
    console.log(props.items);
    let siblingFound = false;
    while (i <= props.items.length && !siblingFound) {
        if (props.items[i]?.data.parentId === item.data.parentId && props.items[i]?.id !== item.id) {
            siblingFound = true;
            return props.items[i];
        }
        i++;
    }
    if (!siblingFound) {
        return null;
    }
}

function getBounds(value: { start: number, end: number }) {
    timelineStart.value = value.start;
    timelineEnd.value = value.end;
}

</script>

<template>
    <ClientOnly>
        <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute"
                :style="`height:${(lines.spacing + 63.35)}px;width:${timelineWidth}px;`">
                <defs>
                    <marker id="arrow" markerWidth="4" markerHeight="4" viewBox="0 0 10 10" refX="5" refY="5"
                        orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="red" />

                    </marker>
                </defs>
                <path v-for="line in lines.linesArr" :d="`${line.svgPath}`"
                    :style="`fill:none;stroke:${line.colour};stroke-width:3;`" class="z-50" marker-end="url(#arrow)" />
            </svg>
            <Timeline id="timelineElement" :items :groups :initial-viewport-start="bounds.lower"
                :initial-viewport-end="bounds.upper" @change-viewport="getBounds">
                <template #group-label="{ group }">
                    <div class="flex items-center" :style="{ 'margin-left': `${(group.path.length - 1) * 16}px` }">
                        <button v-if="hasChildren(group.id)"
                            class="flex flex-row gap-1 items-center justify-center z-50"
                            @click="toggleExpanded(group.id)">
                            <Icon name="hugeicons:arrow-right-01" class="transition-discrete duration-75 z-50" size="16"
                                :class="{ 'rotate-90': group.expanded }" />
                            {{ group.label }}
                        </button>
                        <span v-else class="ml-5">
                            {{ group.label }}
                        </span>
                    </div>
                </template>

                <template #item="{ item }">
                    <div class="size-full bg-brand ring-md rounded-sm" @click="$emit('selectedTask', item)">
                    </div>
                </template>
            </Timeline>
        </div>
        <template #fallback>
            <AppGanttFallback />
        </template>
    </ClientOnly>
</template>