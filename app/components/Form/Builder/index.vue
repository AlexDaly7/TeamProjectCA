<script setup lang="ts">
type BaseField = {
    label: string,
    name: string,
    placeholder?: unknown;
}

type FieldOptions = 
    { 
        as: 'input', 
        type: 'text' | 'number' | 'date',
    } | { 
        as: 'textarea',
        type: undefined,
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
    fields: (BaseField & FieldOptions)[],
}>();
</script>

<template>
    <span
        v-if="submitError"
        class="text-danger-txt font-bold mb-2">
        {{ submitError }}
    </span>
    <form 
        class="flex flex-col gap-2" 
        @submit.prevent="onSubmit">
        <div
            v-for="field in fields" 
            class="flex flex-col gap-2"
            :key="field.name">
            <Label 
                class="font-medium"
                :for="field.name">
                {{ field.label }}
            </Label>
            <FormBuilderInput
                :as="field.as"
                :name="field.name"
                :type="field.type"
                :disabled="isLoading"
                :placeholder="field.placeholder"
                :error="errors[field.name]" />
            <ErrorMessage 
                class="text-sm text-danger-txt"
                :name="field.name" />
        </div>
        
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