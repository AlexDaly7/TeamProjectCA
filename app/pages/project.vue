<script setup>
    import { Timeline } from 'vue-timeline-chart';
    import "vue-timeline-chart/style.css";
    const items = [
        {id: "item1", group: "group1", type: "point", start: 1705878000000 },
        {id: "item2", group: "group1", type: "point", start: 1705858000000 }
    ]   
    const groups = [
        {id:"group1", label: "Group 1"},
        {id:"group2", label: "Group 2"}
    ]
</script>

<template>
    <Timeline
        :items="items"
        :groups="groups"
        :minViewportDuration="50000000"
        :viewport-min="1740051756"
    />

</template>