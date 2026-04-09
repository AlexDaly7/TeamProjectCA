<script setup lang="ts">
withDefaults(defineProps<{
    asType?: 'input' | 'textarea',
    name: string,
    label: string,
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
    <div class="flex flex-col gap-2">
        <Label 
            class="font-medium"
            :for="name">
            {{ label }}
        </Label>
        <FormBuilderInputRaw
            :as="asType"
            :name="name"
            :type="type"
            :disabled="disabled"
            :placeholder="placeholder"
            :error="error" />
        <ErrorMessage 
            class="text-sm text-danger-txt"
            :name="name" />
    </div>
</template>