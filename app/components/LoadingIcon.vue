<script setup lang="ts">
withDefaults(defineProps<{
    size?: number;
}>(), {
    size: 20
});
</script>

<template>
    <Icon 
        name="hugeicons:loading-03" 
        class="animate-spin"
        :size />
</template>