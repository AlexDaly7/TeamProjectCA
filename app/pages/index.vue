<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const auth = useAuth();

useAppHead({ pageTitle: 'Mórchlár: Collaborative team project tracking with GitHub integration', raw: true })

useSeoMeta({
    description: 'Collaborative team project tracking with GitHub integration.',
    ogDescription: 'Collaborative team project tracking with GitHub integration.',
    ogSiteName: 'Mórchlár',
    ogTitle: 'Mórchlár: Collaborative team project tracking with GitHub integration',
    ogImage: 'http://www.morchlar.com/media/landing/logo.png',
    twitterCard: 'summary_large_image',
});

const signInPressed = ref(false);
const isSigningIn = computed(() => auth.isLoading.value || signInPressed.value);

function signIn() {
    signInPressed.value = true;

    auth.signInWithGitHub();
}
</script>

<template>
    <div class="h-full grow flex flex-col items-center justify-center">
        <img 
            class="w-200" 
            src="/media/landing/logo.png" 
            alt="The Logo for Mórchlár"
            data-testid="logo">
        <p class="text-txt-secondary mb-4">Collaborative team project tracking with GitHub integration.</p>
        <AppButton 
            class="inline-flex gap-2 items-center"
            :disabled="isSigningIn"
            @click="signIn">
            <LoadingIcon v-if="isSigningIn" />
            <Icon
                v-else
                name="hugeicons:github-01"
                size="20"/>
            Sign in with GitHub
        </AppButton>
    </div>
    <div class="h-full grow flex flex-col items-center justify-center">
        <p class="text-[75px]">Features!</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 mt-2 mb-2 mx-4 text-center">
        <div class="h-full grow flex flex-col bg-main-700 border-solid border-main-500 border-[5px] rounded-xl p-5 mx-2">
            <h1 class="text-[50px]"> Organisations! </h1>
            <p class="text-[25px]"> Create your organisation and give it a custom link!</p>
            <video class="border-main-500 border-[5px] rounded-xl" autoplay loop muted>
                <source src="/media/landing/Organisations.webm" type="video/webm">
            </video>
        </div>
        <div class="h-full grow flex flex-col items-left justify-left bg-main-700 border-solid border-main-500 border-[5px] rounded-xl p-5 mx-2">
            <h1 class="text-[50px]"> Add Members! </h1>
            <p class="text-[25px]"> Collaborate with your teammates within the organisation!</p>
            <img class="border-main-500 border-[5px] rounded-xl" src="/media/landing/task-example.png" alt="Graphic demonstrating Mórchlár's gantt chart task feature">
        </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 mt-2 mb-2 mx-4 text-center">
        <div class="h-full grow flex flex-col bg-main-700 border-solid border-main-500 border-[5px] rounded-xl p-5 mx-2">
            <h1 class="text-[50px]">GitHub Integration!</h1>
            <p class="text-[25px]">Import your repos directly into the website!</p>
            <img class="border-main-500 border-[5px] rounded-xl" src="" alt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis odio nec!">
        </div>
        <div class="h-full grow flex flex-col bg-main-700 border-solid border-main-500 border-[5px] rounded-xl p-5 mx-2">
            <h1 class="text-[50px]">Add Tasks and Subtasks!</h1>
            <p class="text-[25px]">Add tasks and subtasks to our Gannt chart and see how they link!</p>
            <img class="border-main-500 border-[5px] rounded-xl" src="" alt="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis odio nec!">
        </div>
    </div>
</template>