<script setup lang="ts" generic="TValidationSchema extends z.ZodType">
import type { z } from 'zod';
import type { ActionButtonResult } from '~/utils/types/actionButton';

type FieldType = {
    label: string,
    name: string,
    placeholder: unknown,
    required: boolean,
    disabled?: boolean,
    watcher?: (values: z.infer<TValidationSchema>) => unknown,
    watcherDebounceMs?: number
} & ({
    fieldType: 'text' | 'text-multiline' | 'text-email',
    placeholder: string;
    watcher?: (values: z.infer<TValidationSchema>) => string
});

const props = defineProps<{
    onSubmit: (() => ActionButtonResult) | (() => Promise<ActionButtonResult>),
    isLoading: boolean,
    validationSchema: TValidationSchema,
    submitBtn: {
        icon: string,
        label: string,
    },
    fields: FieldType[],
}>();


const submitError = ref<string | null>(null);

const { errors, meta, values, setFieldValue } = useForm({
    validationSchema: toTypedSchema(props.validationSchema),
});

const isLoading = ref(false);

async function submitHelper() {
    isLoading.value = true;
    submitError.value = null;

    const result = await props.onSubmit();
    if (result.error) {
        submitError.value = result.message ?? 'Unknown error.';
    }
    
    isLoading.value = false;
}

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

watch(values, (newValues) => {
    for (const field of props.fields) {
        if (!field.watcher) continue;

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
        
        <template
            v-for="{ fieldType, name, label, disabled, placeholder, required } in fields"
            :key="name">
            <div class="flex flex-col gap-2">
                <Label 
                    class="font-medium"
                    :for="name">
                    {{ label }}
                </Label>
                <FormBuilderInputRaw
                    :as-type="fieldType === 'text-multiline' ? 'textarea' : 'input'"
                    :name="name"
                    :disabled="disabled"
                    :required="required"
                    :placeholder="placeholder"
                    :error="errors[name]" />
                <ErrorMessage 
                    class="text-sm text-danger-txt"
                    :name="name" />
            </div>
        </template>
        
        <div class="flex justify-end mt-2">
            <AppButton
                type="submit" 
                :loading="isLoading"
                :disabled="!meta.valid">
                <div class="inline-flex items-center gap-2">
                    <Icon :name="submitBtn.icon" />
                    <span>{{ submitBtn.label }}</span>
                </div>
            </AppButton>
        </div>
    </form>
</template>