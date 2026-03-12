<script setup lang="ts">
type BaseField = {
    label: string,
    name: string,
}

type FieldOptions = 
    { 
        as: 'input', 
        type: 'text' | 'number' | 'date',
    } | { 
        as: 'textarea'
    };

defineProps<{
    onSubmit: () => void,
    isLoading: boolean,
    errors: Record<string, string | undefined>,
    submitBtn: {
        icon: string,
        label: string,
    },
    fields: (Record<string, any> & (BaseField & FieldOptions))[],
}>();
</script>

<template>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
        <div v-for="{ label, name, as: asType, type, ...attrs } in fields">
            <label>
                <span class="font-medium">
                    {{ label }}
                </span>
                <div class="flex flex-row gap-2">
                    <Field
                        :as="asType"
                        :name
                        :type
                        :disabled="isLoading"
                        :error="errors[name]"
                        v-bind="attrs"
                        class="bg-main-700 w-full h-8 ring-md focus:ring-2! focus:ring-main-50/25 px-4 rounded-md leading-none outline-none"
                        :class="{
                            'ring-danger-bg!': errors[name],
                            'opacity-50': isLoading,
                        }">
                    </Field>
                </div>
                <ErrorMessage :name class="text-sm text-danger-txt" />
            </label>
        </div>
        
        <div class="flex justify-end mt-2">
            <ButtonPrimary 
                type="submit" 
                :disabled="isLoading">
                <LoadingSwap :is-loading="isLoading">
                    <div class="inline-flex items-center gap-2">
                        <Icon :name="submitBtn.icon" />
                        {{ submitBtn.label }}
                    </div>
                </LoadingSwap>
            </ButtonPrimary>
        </div>
    </form>
</template>