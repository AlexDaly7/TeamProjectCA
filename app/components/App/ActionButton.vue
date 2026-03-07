<script setup lang="ts">
const props = withDefaults(defineProps<{
    action: () => Promise<{ error: boolean, message?: string }>,
    title?: string,
    description?: string,
    requireAreYouSure?: boolean,
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger',
}>(), {
    title: 'Are you sure?',
    description: 'This action is irreversible.',
    requireAreYouSure: false,
    variant: 'secondary',
});

const variantMap: Record<
    'primary' | 'secondary' | 'tertiary' | 'danger', 
    ReturnType<typeof resolveComponent>
> = {
    primary: resolveComponent('ButtonPrimary'),
    secondary: resolveComponent('ButtonSecondary'),
    tertiary: resolveComponent('ButtonTertiary'),
    danger: resolveComponent('ButtonDanger'),
};

const isLoading = ref(false);
const dialogOpen = ref(false);

async function performAction() {
    isLoading.value = true;
    try {
        const data = await props.action();
        if (data.error) {
            // todo: replace with toast or in-ui error box
            alert(`Error: ${data.message ?? 'Unknown error'}`);
        } else {
            // todo: toast for success maybe?
        }
    } finally {
        isLoading.value = false;
        dialogOpen.value = false;
    }
}

function handleClick() {
    if (props.requireAreYouSure) {
        dialogOpen.value = true
    } else {
        performAction();
    }
}

</script>

<template>
    <template v-if="!requireAreYouSure">
        <component 
            v-bind="$attrs"
            :disabled="isLoading"
            :is="variantMap[variant]"
            @click="handleClick">
            <LoadingSwap :is-loading="isLoading">
                <slot name="trigger">Button</slot>
            </LoadingSwap>
        </component>
    </template>

    <template v-else>
        <AlertDialogRoot 
            :open="dialogOpen || isLoading"
            @update:open="val => { if (isLoading) dialogOpen = val }">
            <AlertDialogTrigger :as-child="true">
                <component 
                    v-bind="$attrs"
                    :is="variantMap[variant]"
                    @click="handleClick">
                    <slot name="trigger">Button</slot>
                </component>
            </AlertDialogTrigger>

            <AlertDialogPortal>
                <AlertDialogOverlay class="bg-black/50 fixed inset-0 z-30" />

                <AlertDialogContent class="fixed top-1/2 left-1/2 max-h-[80dvh] w-[90dvw] max-w-md -translate-x-1/2 -translate-y-1/2 z-100
                    bg-main-800 rounded-xl p-6 shadow-md shadow-black ring-md
                    focus:outline-none">
                    <AlertDialogTitle class="text-xl font-semibold">
                        {{ title }}
                    </AlertDialogTitle>

                    <AlertDialogDescription class="text-txt-secondary mt-4 mb-5 leading-normal">
                        {{ description }}
                    </AlertDialogDescription>

                    <div class="flex justify-end gap-4">
                        <AlertDialogCancel :as-child="true">
                            <slot name="cancel-button">
                                <ButtonSecondary
                                    class="min-w-24"
                                    :disabled="isLoading"
                                    @click="dialogOpen = false">
                                    Cancel
                                </ButtonSecondary>
                            </slot>
                        </AlertDialogCancel>
                        
                        <AlertDialogAction :as-child="true">
                            <slot name="action-button">
                                <ButtonPrimary
                                    class="min-w-24"
                                    :disabled="isLoading"
                                    @click="performAction">
                                    <LoadingSwap :is-loading="isLoading">
                                        Confirm
                                    </LoadingSwap>
                                </ButtonPrimary>
                            </slot>
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialogPortal>
        </AlertDialogRoot>
    </template>
</template>