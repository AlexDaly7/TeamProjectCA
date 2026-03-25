<script setup lang="ts">
withDefaults(defineProps<{
    icon: string,
    text: string,
    variant?: 'default' | 'danger'
}>(), {
    variant: 'default',
});

defineEmits(['select']);
</script>

<template>
    <DropdownMenuItem
        class="w-full outline-none inline-flex gap-1.5 items-center p-2 hover:bg-main-600 rounded-lg select-none cursor-pointer"
        :class="{ 'text-red-400': variant === 'danger' }"
        @select="$emit('select')">
        <Icon :name="icon" />
        <span>{{ text }}</span>
    </DropdownMenuItem>
</template>