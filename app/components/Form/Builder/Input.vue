<script setup lang="ts">
withDefaults(defineProps<{
    asType?: 'input' | 'textarea',
    name: string,
    type?: string,
    disabled?: boolean
    error?: string,
    placeholder?: unknown,
}>(), {
    asType: 'input',
    type: 'text',
    disabled: false,
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
        v-bind="$attrs"
        class="bg-main-700 w-full h-8 ring-md focus:ring-2! focus:ring-main-50/25 px-4 rounded-md leading-none outline-none"
        :class="{
            'ring-danger-txt!': error,
            'opacity-50': disabled,
        }">
    </Field>
</template>