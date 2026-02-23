<script setup lang="ts">
const auth = useAuth();

async function addProject(title: string) {
    await $fetch("/api/project", {
        method: "POST",
        body: {
            title: title
        }
    });
}

const { data: repos, pending, error } = useFetch('/api/github/repos');
</script>

<template>
    <div>
        <button v-on:click="addProject('Hi!')">Create Project</button>
        {{ auth.user }}
    </div>
    <div v-if="pending">
        Loading...
    </div>
    <div v-else-if="error">
        Error: {{ error }}
    </div>
    <div v-else>
        {{ repos }}
    </div>
</template>