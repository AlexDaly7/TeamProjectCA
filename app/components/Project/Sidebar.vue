<script setup lang="ts">
const route = useRoute();

const groupId = computed(() => route.params.groupId);
const projectId = computed(() => route.params.projectId);
</script>

<template>
    <div class="flex flex-col gap-2">
        <SidebarLink
            :to="{ name: 'dashboard-group-groupId-project-projectId', params: { groupId, projectId } }"
            label="Timeline"
            icon="hugeicons:bar-chart-horizontal" />
        <SidebarLink
            :to="{ name: 'dashboard-group-groupId-project-projectId-settings', params: { groupId, projectId } }"
            label="Settings"
            icon="hugeicons:settings-01" />
    </div>
</template>