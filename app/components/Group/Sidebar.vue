<script setup lang="ts">
const route = useRoute();

const groupId = computed(() => route.params.groupId);
const projectId = computed(() => route.params.projectId);
</script>

<template>
    <div class="flex flex-col gap-2">
        <SidebarLink
            :to="{ name: 'dashboard-group-groupId', params: { groupId } }"
            label="Projects"
            icon="hugeicons:grid-view" />
        <SidebarLink
            :to="{ name: 'dashboard-group-groupId-members', params: { groupId } }"
            label="Members"
            icon="hugeicons:user-group" />
        <SidebarLink
            :to="{ name: 'dashboard-group-groupId-settings', params: { groupId } }"
            label="Settings"
            icon="hugeicons:settings-01" />
    </div>
</template>