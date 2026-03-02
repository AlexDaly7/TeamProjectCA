<script setup lang="ts">
const props = defineProps<{
    image?: string;
    name: string;
}>()

const initials = computed(() => {
    const nameSplit = props.name.split(' ');
    if (nameSplit[0] && nameSplit[1]) {
        return String(nameSplit[0]) + String(nameSplit[1]);
    } else if (props.name.length > 1) {
        return String(props.name[0]) + String(props.name[0]);
    } else {
        return '?';
    }
});
</script>

<template>
    <AvatarRoot class="bg-black inline-flex size-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <AvatarImage 
            class="h-full w-full rounded-[inherit] object-cover" 
            :src="String(image)" 
            :alt="name" />
        <AvatarFallback
            class="text-txt-primary leading-1 flex h-full w-full items-center justify-center bg-brand text-sm font-medium"
            :delay-ms="600">
            {{ initials }}
        </AvatarFallback>
    </AvatarRoot>
</template>