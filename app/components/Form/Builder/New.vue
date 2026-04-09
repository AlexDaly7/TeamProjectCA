<script setup lang="ts" generic="TValidationSchema extends z.ZodType">
import type { DateRange } from 'reka-ui';
import type { z } from 'zod';
import type { ActionButtonResult } from '~/utils/types/actionButton';

type FieldType = {
    label: string,
    name: string,
    required: boolean,
    disabled?: boolean,
    watcherDebounceMs?: number
} & ({
    fieldType: 'text' | 'text-multiline' | 'text-email',
    placeholder: string;
    selectItems?: undefined,
    watcher?: (values: z.infer<TValidationSchema>) => string
} | {
    fieldType: 'date-range',
    placeholder?: DateRange,
    selectItems?: undefined,
    watcher?: (values: z.infer<TValidationSchema>) => DateRange
} | {
    fieldType: 'select',
    placeholder: string,
    selectItems: {
        list: { label: string, value: string, iconUrl?: string }[],
        isPending?: boolean,
        pendingText?: string,
        errorText?: string,
    },
    watcher?: (values: z.infer<TValidationSchema>) => string,
});

const props = defineProps<{
    onSubmit: ((values: z.infer<TValidationSchema>) => ActionButtonResult) 
        | ((values: z.infer<TValidationSchema>) => Promise<ActionButtonResult>),
    isLoading: boolean,
    validationSchema: TValidationSchema,
    submitBtn: {
        icon: string,
        label: string,
    },
    fields: FieldType[],
}>();


const submitError = ref<string | null>(null);

const { errors, meta, values, setFieldValue, isFieldTouched } = useForm({
    validationSchema: toTypedSchema(props.validationSchema),
});

const isSubmitting = ref(false);

// Ran on submit
async function submitHelper() {
    isSubmitting.value = true;
    submitError.value = null;

    const result = await props.onSubmit(values as unknown as z.infer<TValidationSchema>);
    if (result.error) {
        submitError.value = result.message ?? 'Unknown error.';
    }
    
    isSubmitting.value = false;
}


const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

watch(values, (newValues) => {
    for (const field of props.fields) {
        // If no watcher skip
        if (!field.watcher) continue;

        // If user already modified it themselves, skip doing the watcher's update.
        if (isFieldTouched(field.name)) continue;

        if (field.watcherDebounceMs) {
            clearTimeout(debounceTimers.get(field.name));

            debounceTimers.set(field.name, setTimeout(() => {
                const returnedValue = field.watcher!(newValues as unknown as z.infer<TValidationSchema>);
                setFieldValue(field.name, returnedValue);
            }, field.watcherDebounceMs));
        } else {
            const returnedValue = field.watcher(newValues as unknown as z.infer<TValidationSchema>);
            setFieldValue(field.name, returnedValue);
        }
    }
}, { deep: true });

onUnmounted(() => debounceTimers.forEach(clearTimeout));
</script>

<template>
    <ErrorHeader :error="submitError" />

    <form 
        class="flex flex-col gap-2" 
        @submit.prevent="submitHelper">
        
        <div 
            v-for="{ fieldType, name, label, disabled, placeholder, required, selectItems } in fields"
            class="flex flex-col gap-2"
            :key="name">
            <Label 
                class="font-medium"
                :for="name">
                {{ label }}
            </Label>

            <template 
                v-if="fieldType === 'text'
                    || fieldType === 'text-email'
                    || fieldType === 'text-multiline'">
                <FormBuilderInputRaw
                    :as-type="fieldType === 'text-multiline' ? 'textarea' : 'input'"
                    :name="name"
                    :disabled="disabled ?? false"
                    :required="required"
                    :placeholder="placeholder"
                    :error="errors[name]" />
            </template>
            <template 
                v-else-if="fieldType === 'date-range'">
                <FormBuilderDateRangeInput
                    :name="name"
                    :disabled="disabled ?? false"
                    :required="required"
                    :placeholder="placeholder"
                    :error="errors[name]" />
            </template>
            <template 
                v-else-if="fieldType === 'select'">
                <FormBuilderSelect
                    :name="name"
                    :disabled="disabled ?? false"
                    :required="required"
                    :placeholder="placeholder"
                    :items="selectItems.list"
                    :items-pending-text="selectItems.pendingText"
                    :items-pending-error-text="selectItems.errorText"
                    :error="errors[name]" />
            </template>

            <ErrorMessage 
                class="text-sm text-danger-txt"
                :name="name" />
        </div>
        
        <div class="flex justify-end mt-2">
            <AppButton
                type="submit" 
                :loading="isSubmitting"
                :disabled="!meta.valid">
                <div class="inline-flex items-center gap-2">
                    <Icon :name="submitBtn.icon" />
                    <span>{{ submitBtn.label }}</span>
                </div>
            </AppButton>
        </div>
    </form>

    {{ values }}
</template>