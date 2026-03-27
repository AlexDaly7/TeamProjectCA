<script setup lang="ts">
import type { TimelineItemWithData } from '~/utils/types/timeline';

defineProps<{
    selectedTask: TimelineItemWithData | null
}>()

const isOpen = defineModel('isOpen', { default: false });
</script>

<template>
    <DialogRoot v-model:open="isOpen">
        <DialogPortal>
            <Transition name="drawer-fade">
                <DialogOverlay class="fixed bg-black/50 inset-0" />
            </Transition>
            <Transition name="drawer-slide">
                <DialogContent class="h-full w-sm fixed bottom-0 right-0 bg-main-800 border-l border-main-50/10 rounded-l-lg z-10 focus:outline-none">
                    <div class="px-4 pt-2">
                        <DialogTitle class="text-center mb-3 text-2xl text-bold">
                            <h5 class="text-left">Selected Task:</h5>
                            {{ selectedTask?.data.title }}
                        </DialogTitle>
                        <DialogDescription class="p-2 bg-main-700 rounded-lg ">
                            <h4>Description:</h4>
                            {{ selectedTask?.data.description }}
                        </DialogDescription>

                    </div>

                    <div class="bottom-0 px-4 pt-2">
                        <slot></slot>
                    </div>
                </DialogContent>
            </Transition>
        </DialogPortal>
    </DialogRoot>
</template>