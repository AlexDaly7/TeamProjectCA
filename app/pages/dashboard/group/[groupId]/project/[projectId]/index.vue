<script setup lang="ts">
import { Timeline, type TimelineGroup, type TimelineItem } from 'vue-timeline-chart';
import "vue-timeline-chart/style.css";
import { CalendarDateTime } from '@internationalized/date';

const items = ref<TimelineItem[]>([
    {id: "item1", group: "group1", type: "point", start: 1705878000000 },
    {id: "item2", group: "group1", type: "point", start: 1705858000000 }
]);
const groups: TimelineGroup[] = [
    {id:"group1", label: "Group 1"},
    {id:"group2", label: "Group 2"}
]
const timeline = ref();

let taskName;
let taskDesc;
const dateValue = ref<any>(null);
let timeValue1 = ref();
let timeValue2 = ref();

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
    const date1 = new Date(dateValue.value.start.year, dateValue.value.start.month-1, dateValue.value.start.day, dateValue.value.start.hour);
    const date2 = new Date(dateValue.value.end.year, dateValue.value.end.month-1, dateValue.value.end.day, dateValue.value.end.hour);

    const { $csrfFetch } = useNuxtApp();
    let result = await $csrfFetch("/api/tasks/1", {
        method: "POST",
        body: { 
            title: taskName,
            desc: taskDesc,
            startTime: date1,
            endTime: date1,
            projectId: 1
        }
    });
    if(result.id) {
        renderTask(date1, date2, "group1");
    }
}

async function renderTask(startTime: Date, endTime: Date, groupNum: string) {
    items.value.push({
        type: "range",
        start: startTime.getTime(),
        end: endTime.getTime(),
        group: groupNum
    });
}
</script>

<template>
    <div class="projectHeader">
        
    </div>
    <Timeline
        ref="timeline"
        :items
        :groups
        :minViewportDuration="50000000"
        :viewport-min="1740051756"
    />

    <div class="taskMain">
        
        <form>
            <input v-model="taskName" placeholder="Task Title"/>
            <input v-model="taskDesc" placeholder="Task Description"/>
            <div class="flex flex-col gap-2 bg-slate-800 p-4 m-4 max-w-md mx-auto rounded-lg ring-1 ring-inset ring-main-50/10">
                <DatePicker v-model:date-value="dateValue"/>
            </div>
            <p>{{ dateValue }}</p>
            <p>{{ timeValue1 }}</p>
        </form>
        <button v-on:click="addTask">Create Task.</button>
    </div>

</template>
