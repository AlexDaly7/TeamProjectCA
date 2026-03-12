<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

const props = withDefaults(defineProps<{
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | undefined;
    type?: 'button' | 'reset' | 'submit';
    bgLevel?: '800' | '700',
    exactActiveClass?: string,
}>(), {
    to: undefined,
    type: 'button',
    bgLevel: '800',
    exactActiveClass: 'bg-main-700! ring-md',
});

const tag = computed(() => {
    if (props.to) return resolveComponent('NuxtLink');
    return 'button';
});
</script>

<template>
    <component
        :is="tag"
        :to="to || undefined"
        :type="!to ? type : undefined"
        :exact-active-class="exactActiveClass"
        class="
            text-txt-primary py-2 px-4 rounded-md cursor-pointer text-center
            not-disabled:hover:scale-102
            not-disabled:active:scale-98
            disabled:opacity-60 disabled:cursor-default
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-txt-secondary
            transition-all duration-75"
        :class="{
            'bg-main-800 not-disabled:hover:bg-main-700 not-disabled:active:bg-main-900': bgLevel === '800',
            'bg-main-700 not-disabled:hover:bg-main-600 not-disabled:active:bg-main-800': bgLevel === '700',
        }">
        <slot />
    </component>
</template>