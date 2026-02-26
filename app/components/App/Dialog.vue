<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{
    title: string;
    description: string;
    triggerAsChild?: boolean; // Should the trigger be the slotted component or a wrapper?
}>(), {
    triggerAsChild: true,
});

</script>

<template>
    <DialogRoot>
        <DialogTrigger :as-child="triggerAsChild">
            <slot name="trigger" />
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="bg-black/50 fixed inset-0 z-30" />

            <DialogContent 
                class="fixed top-1/2 left-1/2 max-h-[80dvh] w-[90dvw] max-w-md -translate-x-1/2 -translate-y-1/2 z-100
                bg-main-800 rounded-xl p-6 shadow-md shadow-black
                focus:outline-none">
                <DialogTitle class="text-xl font-semibold mb-3">
                    {{ title }}
                </DialogTitle>
                <DialogDescription class="text-sm text-txt-secondary leading-snug mb-4">
                    {{ description }}    
                </DialogDescription>
                <slot name="body" />
                <DialogClose
                    class="absolute top-3 right-3"
                    aria-label="Close">
                    <div class="hover:bg-main-700 flex p-1 rounded-full">
                        <Icon name="hugeicons:cancel-01" size="20" />
                    </div>
                </DialogClose>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>