<script setup lang="ts">
import { useAuth } from '~/composables/auth';

const auth = useAuth();
const { $authClient } = useNuxtApp();

function setOpened() {
    $authClient.updateUser({
        selectedGroup: 1,
        selectedProject: 1
    });
}
</script>

<template>
    <div>
        <AppButton @click="auth.signInWithGitHub">
            Sign in with GitHub
        </AppButton>
        <span>{{ auth.user.value?.email }}</span>
    </div>
</template>