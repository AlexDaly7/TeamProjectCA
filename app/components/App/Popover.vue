<script setup lang="ts">
withDefaults(defineProps<{
    showClose?: boolean,
}>(), {
    showClose: false,
});

const isOpen = defineModel('isOpen', { default: false });
</script>

<template>
    <PopoverRoot 
        v-model:open="isOpen"
        v-slot="{ close }">
        <PopoverTrigger :as-child="true">
            <slot name="trigger">
                <span>placeholder popover trigger</span>
            </slot>
        </PopoverTrigger>

        <PopoverPortal>
            <PopoverContent 
                class="bg-main-700 rounded-xl ring-md shadow-sm shadow-black"
                :side-offset="5"
                :collision-padding="5">
                <slot name="content" :close>
                    <span>placeholder popover content</span>
                </slot>

                <PopoverClose
                    v-if="showClose"
                    :as-child="true">
                    <slot name="close">
                        <span>close</span>
                    </slot>
                </PopoverClose>
                <PopoverArrow class="fill-main-700 stroke-main-50/10" />
            </PopoverContent>
        </PopoverPortal>
    </PopoverRoot>
</template>