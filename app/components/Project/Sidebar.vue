<script setup lang="ts">
const route = useRoute();

const orgSlug = computed(() => route.params.orgSlug);
const projectId = computed(() => route.params.projectId);
</script>

<template>
    <div class="flex flex-col gap-2">
        <SidebarLink
            :to="{ name: 'dashboard-orgSlug-projectId', params: { orgSlug, projectId } }"
            label="Tasks"
            icon="hugeicons:bar-chart-horizontal" />
        <SidebarLink
            :to="{ name: 'dashboard-orgSlug-projectId-settings', params: { orgSlug, projectId } }"
            label="Settings"
            icon="hugeicons:settings-01" />
    </div>
</template>