<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

defineProps<{
    to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    icon: string;
    label: string;
}>();
</script>

<template>
    <AppButton
        variant="tertiary-sidebar"
        class="flex flex-row gap-2 items-center"
        exact-active-class="text-txt-primary! bg-main-700! ring-md"
        :to>
        <Icon :name="icon" />
        {{ label }}
    </AppButton>
</template>
