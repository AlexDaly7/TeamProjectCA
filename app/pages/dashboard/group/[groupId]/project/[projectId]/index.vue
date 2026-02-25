<script setup lang="ts">
import { Timeline, type TimelineGroup, type TimelineItem } from 'vue-timeline-chart';
import "vue-timeline-chart/style.css";
const items: TimelineItem[] = [
    {id: "item1", group: "group1", type: "point", start: 1705878000000 },
    {id: "item2", group: "group1", type: "point", start: 1705858000000 }
]   
const groups: TimelineGroup[] = [
    {id:"group1", label: "Group 1"},
    {id:"group2", label: "Group 2"}
]

let taskName;
let taskDesc;
const dateValue = ref<any>(null);
let timeValue1 = ref();
let timeValue2 = ref();

// function createTimeObj() {
//     const date1 = dateValue.value.start;
//     const date2 = dateValue.value.end;
//     let time1 = new CalendarDateTime(date1.year, date1.month, date1.day, timeValue1.value.hour, timeValue1.value.minute);
//     let time2 = new CalendarDateTime(date2.year, date2.month, date2.day, timeValue2.value.hour, timeValue2.value.minute);
//     console.log(time1);
//     console.log(time2);
// }
</script>

<template>
    <div class="projectHeader">
        
    </div>
    <Timeline
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
        <!-- <button v-on:click="createTimeObj">Create Task.</button> -->
    </div>

</template>
