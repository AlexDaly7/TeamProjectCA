<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue';

const props = withDefaults(defineProps<{
    name: string;
    label: string;
    type?: InputTypeHTMLAttribute;
    placeholder?: string;
    required?: boolean;
}>(), {
    type: 'text',
});

const modelValue = defineModel<string | null>('modelValue', {
    default: null,
});
</script>

<template>
    <Label 
        :for="name" 
        class="text-sm text-txt-secondary">
        {{ label }}
    </Label>
    <input 
        v-model="modelValue" 
        class="h-8 px-4 mb-2 bg-main-700 ring-md rounded-md leading-none outline-none"
        :name
        :id="name"
        :type
        :placeholder
        :required />
</template>