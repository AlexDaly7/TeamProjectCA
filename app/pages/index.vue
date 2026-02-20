<script setup lang="ts">
import { useAuth } from '~/composables/auth';

const auth = useAuth();
</script>

<template>
    <div>
        <button @click="auth.signInWithGitHub">
            Sign in with GitHub
        </button>
        <span>{{ auth.user.value?.email }}</span>
    </div>
</template>