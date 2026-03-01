<script setup lang="ts">
import { useAuth } from '~/composables/auth';

const auth = useAuth();

const signInPressed = ref(false);
const isSigningIn = computed(() => auth.isLoading.value || signInPressed.value);

function signIn() {
    signInPressed.value = true;

    auth.signInWithGitHub();
}
</script>

<template>
    <div class="h-full grow flex flex-col items-center justify-center">
        <img class="w-200"src="/logo.png" alt="The Logo for Mórchlár">
        <p class="text-txt-secondary mb-4">Collaborative team project tracking with GitHub integration.</p>
        <ButtonPrimary 
            class="inline-flex gap-2 items-center"
            :disabled="isSigningIn"
            @click="signIn">
            <LoadingIcon v-if="isSigningIn" />
            <Icon
                v-else
                name="hugeicons:github-01"
                size="20"/>
            Sign in with GitHub
        </ButtonPrimary>
    </div>
</template>