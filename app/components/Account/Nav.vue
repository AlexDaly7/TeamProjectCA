<script setup lang="ts">
const auth = useAuth();
</script>

<template>
    <div class="flex flex-col gap-8 max-w-full md:max-w-3xl w-full mx-auto mt-8">
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

        <div class="bg-main-800 p-2 ring-md rounded-md grid grid-cols-5 gap-2">
            <ButtonTertiary 
                class="inline-flex items-center justify-center gap-2"
                :to="{ name: 'dashboard-account-profile' }">
                <Icon name="hugeicons:user" />
                Profile
            </ButtonTertiary>
            <ButtonTertiary 
                class="inline-flex items-center justify-center gap-2"
                :to="{ name: 'dashboard-account-security' }">
                <Icon name="hugeicons:shield-01" />
                Security
            </ButtonTertiary>
            <ButtonTertiary 
                class="inline-flex items-center justify-center gap-2"
                :to="{ name: 'dashboard-account-session' }">
                <Icon name="hugeicons:key-01" />
                Session
            </ButtonTertiary>
            <ButtonTertiary 
                class="inline-flex items-center justify-center gap-2"
                :to="{ name: 'dashboard-account-accounts' }">
                <Icon name="hugeicons:link-01" />
                Accounts
            </ButtonTertiary>
            <ButtonTertiary 
                class="inline-flex items-center justify-center gap-2"
                :to="{ name: 'dashboard-account-danger' }">
                <Icon name="hugeicons:alert-01" />
                Danger
            </ButtonTertiary>
        </div>
    </div>
</template>