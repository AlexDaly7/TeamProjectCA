<script setup>
    async function addProject(title) {
        let response = await $fetch("/api/project", {
            method: "POST",
            body: {
                title: title
            }
        });
        response = await response.json();
        console.log(response);
    }
</script>

<template>
    <div>
        <button v-on:click="addProject('Hi!')">Create Project</button>
    </div>

</template>