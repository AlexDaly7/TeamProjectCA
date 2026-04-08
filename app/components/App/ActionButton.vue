<script setup lang="ts">
import type { ActionButtonResult } from '~/utils/types/actionButton';
import type { ButtonSize, ButtonVariant } from '~/utils/types/buttonTypes';

const props = withDefaults(defineProps<{
    action: (() => Promise<ActionButtonResult>) | Promise<ActionButtonResult>,
    title?: string,
    description?: string,
    requireAreYouSure?: boolean,
    variant?: ButtonVariant,
    size?: ButtonSize,
}>(), {
    title: 'Are you sure?',
    description: 'This action is irreversible.',
    requireAreYouSure: false,
    variant: 'secondary',
    size: 'md',
});

const emit = defineEmits<{
    onSuccess: [],
}>();

const isLoading = ref(false);
const dialogOpen = ref(false);
const submitError = ref<string | null>(null);

async function performAction() {
    isLoading.value = true;
    submitError.value = null;
    try {
        let data: ActionButtonResult;
        if (typeof props.action === 'function') {
            data = await props.action();
        } else {
            data = await props.action;
        }

        if (data.error) {
            submitError.value = data.message ?? 'Unknown error. Please try again.';
        } else {
            emit('onSuccess');
            dialogOpen.value = false;
        }
    } finally {
        isLoading.value = false;
    }
}

function handleClick() {
    if (props.requireAreYouSure) {
        submitError.value = null;
        dialogOpen.value = true;
    } else {
        performAction();
    }
}

</script>

<template>
    <template v-if="!requireAreYouSure">
        <AppButton
            :variant
            :size
            :loading="isLoading"
            v-bind="$attrs"
            @click="handleClick">
            <slot name="trigger">Button</slot>
        </AppButton>
    </template>

    <template v-else>
        <AlertDialogRoot 
            :open="dialogOpen || isLoading"
            @update:open="val => { if (isLoading) dialogOpen = val }">
            <AlertDialogTrigger :as-child="true">
                <AppButton
                    :variant
                    v-bind="$attrs"
                    @click="handleClick">
                    <slot name="trigger">Button</slot>
                </AppButton>
            </AlertDialogTrigger>

            <AlertDialogPortal>
                <Transition name="dialog-fade">
                    <AlertDialogOverlay class="bg-black/50 fixed inset-0 z-30 backdrop-blur-xs" />
                </Transition>

                <Transition name="dialog-scale">
                    <AlertDialogContent class="fixed top-1/2 left-1/2 max-h-[80dvh] w-[90dvw] max-w-md -translate-x-1/2 -translate-y-1/2 z-100
                        bg-main-800 rounded-xl p-6 shadow-md shadow-black ring-md
                        focus:outline-none">
                        <AlertDialogTitle class="text-xl font-semibold mb-2">
                            {{ title }}
                        </AlertDialogTitle>

                        <ErrorHeader :error="submitError" />

                        <AlertDialogDescription class="text-txt-secondary mt-2 mb-5 leading-normal">
                            {{ description }}
                        </AlertDialogDescription>

                        <div class="flex justify-end gap-4">
                            <AlertDialogCancel :as-child="true">
                                <slot name="cancel-button">
                                    <AppButton
                                        variant="secondary"
                                        class="min-w-24"
                                        :loading="isLoading"
                                        @click="dialogOpen = false">
                                        Cancel
                                    </AppButton>
                                </slot>
                            </AlertDialogCancel>
                            
                            <AlertDialogAction :as-child="true">
                                <slot name="action-button">
                                    <AppButton
                                        class="min-w-24"
                                        :loading="isLoading"
                                        @click="performAction">
                                        Confirm
                                    </AppButton>
                                </slot>
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </Transition>
            </AlertDialogPortal>
        </AlertDialogRoot>
    </template>
</template>