<script setup lang="ts">
const route = useRoute();
// https://nuxt.com/docs/4.x/api/composables/use-fetch#reactive-keys-and-shared-state
const id = computed(() => route.params.id);

const { data, pending, error } = useFetch(() => `/api/projects/${id.value}`, { method: 'GET' })

function createProject() {
    // TODO
}

</script>

<template>
    <div>
        group: {{ route.params.id }}
    </div>
    <div v-if="pending">
        Loading...
    </div>
    <div v-else-if="error">
        {{ error }}
    </div>
    <div v-else>
        {{data}}
    </div>
    <AppButton @click="createProject">
        Import project from GitHub repo
    </AppButton>
</template>