<script setup lang="ts">
const props = defineProps<{
    image?: string;
    name: string;
}>();

const initials = computed(() => {
    const parts = (props.name ?? '').trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length >= 2 ? (parts[1]?.[0] ?? '') : (parts[0]?.[1] ?? '');
    return `${first}${second}`.toUpperCase() || '?';
});
</script>

<template>
    <AvatarRoot
        class="bg-black inline-flex size-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <AvatarImage v-if="image" class="h-full w-full rounded-[inherit] object-cover" :src="image" :alt="name" />
        <AvatarFallback
            class="text-txt-primary leading-1 flex h-full w-full items-center justify-center bg-brand text-sm font-medium"
            :delay-ms="600">
            {{ initials }}
        </AvatarFallback>
    </AvatarRoot>
</template>
