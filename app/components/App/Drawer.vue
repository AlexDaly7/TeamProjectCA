<script setup lang="ts">
const props = defineProps<{
    accessibleTitle: string,
    accessibleDescription: string
}>();

const isOpen = defineModel<boolean>({
    default: false,
});

</script>

<template>
    <DialogRoot 
        v-model:open="isOpen"
        v-slot="{ close }">
        <DialogPortal>
            <Transition name="drawer-fade">
                <DialogOverlay class="fixed bg-black/50 inset-0" />
            </Transition>
            <Transition name="drawer-slide">
                <DialogContent 
                    class="h-full w-sm fixed bottom-0 right-0 bg-main-800 border-l border-main-50/10 rounded-l-lg z-10 focus:outline-none">
                    <VisuallyHidden>
                        <DialogTitle>{{ accessibleTitle }}</DialogTitle>
                        <DialogDescription>{{ accessibleDescription }}</DialogDescription>
                    </VisuallyHidden>
                    
                    <slot :close></slot>
                </DialogContent>
            </Transition>
        </DialogPortal>
    </DialogRoot>
</template>