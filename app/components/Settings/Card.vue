<script setup lang="ts">
import type { ActionButtonResult } from '~/utils/types/actionButton';

withDefaults(
    defineProps<{
        variant?: 'default' | 'danger';
        requireConfirmation?: boolean;
        actionDisabled?: boolean;
        action: (() => Promise<ActionButtonResult>) | Promise<ActionButtonResult>;
    }>(),
    {
        variant: 'default',
        requireConfirmation: false,
        actionDisabled: false,
    },
);

defineEmits<{
    onSuccess: [];
}>();
</script>

<template>
    <div
        class="ring-1 ring-main-50/10 rounded-lg flex flex-col overflow-hidden"
        :class="{
            'ring-danger-bg!': variant === 'danger',
        }">
        <div class="flex flex-col gap-2 p-4 bg-main-800">
            <span class="text-lg font-bold">
                <slot name="title"></slot>
            </span>
            <p class="text-sm text-txt-secondary">
                <slot name="description"></slot>
            </p>

            <slot name="form"></slot>
        </div>

        <div
            class="w-full h-px bg-main-50/10"
            :class="{
                'bg-danger-bg!': variant === 'danger',
            }"></div>

        <div
            class="inline-flex justify-end p-4"
            :class="{
                'bg-danger-bg/10': variant === 'danger',
            }">
            <AppActionButton
                :variant="variant === 'danger' ? 'danger' : 'primary'"
                :require-are-you-sure="requireConfirmation"
                :disabled="actionDisabled"
                :action
                @on-success="$emit('onSuccess')">
                <template #trigger>
                    <slot name="action"></slot>
                </template>
            </AppActionButton>
        </div>
    </div>
</template>
