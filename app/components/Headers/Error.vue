<script setup lang="ts">
defineProps<{
    error?: string | null;
}>();
</script>

<template>
    <div v-if="error" class="w-full bg-danger-bg/60 ring-1 ring-danger-bg/80 ring-inset rounded-sm p-2">
        <span class="text-danger-txt text-sm font-medium">{{ error }}</span>
    </div>
</template>
