<script setup lang="ts">
defineProps<{
    isLoading: boolean,
}>();
</script>

<template>
    <div class="grid grid-cols-1 items-center justify-center">
        <LoadingIcon 
            v-if="isLoading"
            class="mx-auto"
            :size="20" />
        <div
            v-else
            class="col-start-1 col-end-2 row-start-1 row-end-2 w-full">
            <slot />
        </div>
    </div>
</template>