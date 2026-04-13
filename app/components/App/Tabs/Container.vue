<script setup lang="ts">
const props = defineProps<{
    default: string;
    tabs: { name: string; value: string }[];
}>();
</script>

<template>
    <TabsRoot :default-value="default" class="flex flex-col">
        <TabsList class="relative shrink-0 flex mb-2" aria-label="Manage members and invites">
            <TabsIndicator
                class="absolute px-8 left-0 h-0.5 bottom-0 w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] translate-y-px duration-150">
                <div class="bg-red-500 w-full h-full" />
            </TabsIndicator>
            <TabsTrigger
                v-for="tab in tabs"
                :key="tab.value"
                class="text-txt-secondary px-5 p-2 leading-none select-none outline-none data-[state=active]:text-txt-primary border-transparent border-b-2 data-[state=active]:border-main-50"
                :value="tab.value">
                {{ tab.name }}
            </TabsTrigger>
        </TabsList>
        <slot />
    </TabsRoot>
</template>
