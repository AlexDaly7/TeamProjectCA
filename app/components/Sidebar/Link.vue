<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

defineProps<{
    to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    icon: string;
    label: string;
}>();
</script>

<template>
    <ButtonTertiary
        class="flex flex-row gap-2 items-center"
        :to>
        <Icon :name="icon" />
        {{ label }}
    </ButtonTertiary>
</template>