<script setup lang="ts">
withDefaults(defineProps<{
    asType?: 'input' | 'textarea',
    name: string,
    type?: string,
    disabled?: boolean
    error?: string,
    placeholder?: any,
    required?: boolean
}>(), {
    asType: 'input',
    type: 'text',
    disabled: false,
    placeholder: '(placeholder)',
});
</script>

<template>
    <Field
        :as="asType"
        :name
        :type
        :disabled
        :error
        :placeholder
        :required
        class="bg-main-700 w-full ring-md focus:ring-2! focus:ring-main-50/25 rounded-md leading-none outline-none"
        :class="{
            'ring-danger-txt!': error,
            'opacity-50': disabled,
            'h-8 px-4': asType === 'input',
            'p-4 min-h-32': asType === 'textarea',
        }">
    </Field>
</template>