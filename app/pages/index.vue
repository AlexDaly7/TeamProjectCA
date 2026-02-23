<script setup lang="ts">
import { useAuth } from '~/composables/auth';

const auth = useAuth();
</script>

<template>
    <div>
        <AppButton @click="auth.signInWithGitHub">
            Sign in with GitHub
        </AppButton>
        <span>{{ auth.user.value?.email }}</span>
    </div>
</template>