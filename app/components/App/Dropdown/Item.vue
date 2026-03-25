<script setup lang="ts">
import { NuxtLink } from '#components';

withDefaults(defineProps<{
    icon?: string,
    text: string,
    variant?: 'default' | 'danger',
    type?: 'default' | 'link',
}>(), {
    variant: 'default',
    type: 'default',
});

defineEmits(['select']);
</script>

<template>
    <DropdownMenuItem
        class="w-full outline-none inline-flex gap-1.5 items-center p-2 hover:bg-main-600 rounded-lg select-none cursor-pointer"
        :class="{ 'text-red-400': variant === 'danger' }"
        :as="type === 'link' ? NuxtLink : 'div'"
        @select="$emit('select')">
        <Icon 
            v-if="icon" 
            :name="icon" />
        <span>{{ text }}</span>
    </DropdownMenuItem>
</template>