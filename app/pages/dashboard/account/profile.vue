<script setup lang="ts">
definePageMeta({
    sidebarType: 'user',
});

const auth = useAuth();
</script>

<template>
    <AccountPageWrapper>
        <div v-if="!auth.user.value">
            Loading profile...
        </div>
        <div v-else class="flex flex-row gap-2 items-center">
            <AppAvatar 
                class="size-21"
                :image="auth.user.value.image ?? undefined" 
                :name="auth.user.value.name" />
            <div class="flex flex-col">
                <span class="text-3xl font-bold">{{ auth.user.value.name }}</span>
                <span class="text-txt-secondary">{{ auth.user.value.email }}</span>
            </div>
        </div>
    </AccountPageWrapper>
</template>