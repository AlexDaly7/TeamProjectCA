<script setup lang="ts">
type FieldType = {
    fieldType: 'text' | 'text-multiline' | 'text-email'
    label: string,
    name: string,
    disabled?: boolean;
    placeholder?: unknown,
};

defineProps<{
    onSubmit: () => void,
    isLoading: boolean,
    isValid: boolean;
    errors: Record<string, string | undefined>,
    submitError?: string;
    submitBtn: {
        icon: string,
        label: string,
    },
    fields: (FieldType)[],
}>();
</script>

<template>
    <ErrorHeader :error="submitError" />

    <form 
        class="flex flex-col gap-2" 
        @submit.prevent="onSubmit">
        
        <template
            v-for="field in fields"
            :key="field.name">
            <FormBuilderInput
                v-if="
                    field.fieldType === 'text' ||
                    field.fieldType === 'text-email'"
                asType="input"
                :name="field.name"
                :label="field.label"
                :type="field.fieldType === 'text' ? 'text' : 'email'"
                :disabled="isLoading"
                :placeholder="field.placeholder"
                :error="errors[field.name]" />
        </template>
        
        <div class="flex justify-end mt-2">
            <AppButton
                type="submit" 
                :loading="isLoading"
                :disabled="!isValid">
                <div class="inline-flex items-center gap-2">
                    <Icon :name="submitBtn.icon" />
                    <span>{{ submitBtn.label }}</span>
                </div>
            </AppButton>
        </div>
    </form>
</template>