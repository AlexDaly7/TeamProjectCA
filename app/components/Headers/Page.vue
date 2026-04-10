<script setup lang="ts">
defineProps<{
    title: string,
    description: string,
}>();
</script>

<template>
    <h1 class="text-3xl font-bold">{{ title }}</h1>
    <p class="text-sm text-txt-secondary mt-2">{{ description }}</p>

    <div class="w-full h-0.5 my-4 bg-main-800"></div>
</template>