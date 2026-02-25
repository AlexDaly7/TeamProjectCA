<script setup lang="ts">
const route = useRoute();
// https://nuxt.com/docs/4.x/api/composables/use-fetch#reactive-keys-and-shared-state
const groupId = computed(() => route.params.groupId);

const { data: projects, pending: projectsPending, error: projectsError } = useFetch(() => `/api/projects/${groupId.value}`, { method: 'GET' })

function createProject() {
    // TODO
}

</script>

<template>
    <div>
        group: {{ groupId }}
    </div>
    <div 
        v-if="projectsPending"
        class="mt-4 grow flex items-center justify-center">
        <Icon 
            name="hugeicons:loading-03" 
            class="animate-spin"
            size="32" />
    </div>
    <div 
        v-else-if="projectsError"
        class="mt-4 grow flex items-center justify-center">
        An error occured loading projects: {{ projectsError ?? 'Unknown Error' }}
    </div>
    <div 
        v-else
        class="h-full mt-4 grow grid gap-2 grid-cols-4 overflow-y-auto">
        <RouterLink
            v-for="project in projects"
            :key="project.groupId"
            class="bg-main-800 flex flex-col gap-2 max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
            :to="{ name: 'dashboard-group-groupId-project-projectId', params: { groupId, projectId: project.id }  }">
            <span class="text-lg font-semibold">{{ project.title }}</span>
        </RouterLink>
        <button
            class="bg-main-800 flex items-center justify-center max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
            @click="createProject">
            <span>Import project from GitHub repo</span>
        </button>
    </div>
</template>