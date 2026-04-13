<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const auth = useAuth();

useAppHead({ pageTitle: 'Mórchlár: Collaborative team project tracking with GitHub integration', raw: true });

useSeoMeta({
    description: 'Collaborative team project tracking with GitHub integration.',
    ogDescription: 'Collaborative team project tracking with GitHub integration.',
    ogSiteName: 'Mórchlár',
    ogTitle: 'Mórchlár: Collaborative team project tracking with GitHub integration',
    ogImage: 'http://www.morchlar.com/media/landing/logo.webp',
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
    <main class="h-full w-full max-w-6xl mx-auto flex flex-col items-center justify-center scroll-smooth px-4">
        <nav
            class="fixed top-0 left-1/2 -translate-x-1/2 flex flex-row gap-0.5 z-10 bg-main-800 ring-md rounded-full p-1 mt-2 shadow-sm shadow-black text-sm font-semibold">
            <RouterLink to="#hero" class="rounded-full p-2 px-4 hover:bg-main-700 transition-colors duration-75">
                Home
            </RouterLink>
            <RouterLink to="#features" class="rounded-full p-2 px-4 hover:bg-main-700 transition-colors duration-75">
                Features
            </RouterLink>
            <a
                href="https://www.youtube.com/watch?v=M3LhtfNq2-c"
                target="_blank"
                class="rounded-full p-2 px-4 hover:bg-main-700 transition-colors duration-75">
                Demo ↗
            </a>
            <a
                href="https://github.com/Morchlar/Morchlar"
                target="_blank"
                class="rounded-full p-2 px-4 hover:bg-main-700 transition-colors duration-75">
                GitHub ↗
            </a>
        </nav>

        <section class="w-full max-w-2xl mt-48 text-center">
            <h1 id="hero" class="sr-only absolute top-0">Mórchlár</h1>

            <img
                src="/media/landing/logo.webp"
                width="1909"
                height="380"
                alt="Mórchlár"
                fetchpriority="high"
                class="w-full drop-shadow-md drop-shadow-black"
                data-testid="hero-img" />

            <p class="text-txt-secondary mt-2 mb-4">Collaborative team project tracking with GitHub integration.</p>

            <AppButton class="inline-flex gap-2 items-center" :disabled="isSigningIn" @click="signIn">
                <LoadingIcon v-if="isSigningIn" />
                <Icon v-else name="hugeicons:github-01" size="20" />
                Sign in with GitHub
            </AppButton>
        </section>

        <section>
            <h2 id="features" class="text-3xl font-bold mt-8 mb-4 text-center">Features!</h2>

            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <LandingPageCard
                    title="Organisations"
                    description="Create your organisation and give it a custom link"
                    video-src="/media/landing/Organisations.webm" />
                <LandingPageCard
                    title="Add members"
                    description="Collaborate with your teammates within the organisation"
                    video-src="/media/landing/Adding-Members.webm" />
                <LandingPageCard
                    title="GitHub Integration"
                    description="Import your repos directly into the website"
                    video-src="/media/landing/Project.webm" />
                <LandingPageCard
                    title="Add Tasks and Subtasks"
                    description="Add tasks and subtasks to our Gannt chart and see how they link"
                    video-src="/media/landing/Tasks-and-Subtasks.webm" />
            </div>
        </section>
    </main>

    <footer class="text-center text-sm text-txt-secondary py-6">© {{ new Date().getFullYear() }} Mórchlár</footer>
</template>
