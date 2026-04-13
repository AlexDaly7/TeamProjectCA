<script setup lang="ts">
defineProps<{
    title: string,
    description: string,
    videoSrc: string
}>();
</script>

<template>
    <div class="h-full flex flex-col p-4 bg-main-800 ring-md rounded-xl">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <p class="text-txt-secondary mb-2">{{ description }}</p>

        <video 
            class="ring-md rounded-xl shadow-sm shadow-black"
            autoplay
            loop
            muted
            playsinline>
            <source 
                type="video/webm"
                :src="videoSrc">
        </video>
    </div>
</template>