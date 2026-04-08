<script setup lang="ts">
definePageMeta({
    sidebarType: 'user',
    middleware: [ 'dashboard' ],
});

useAppHead({
    pageTitle: 'Org Selection',
    prefix: 'Home',
});

</script>

<template>
    <div class="flex flex-col items-center justify-center h-full text-txt-secondary">
        <h1 class="text-xl font-semibold">Welcome to Mórchlár!</h1>
        <span class="text-sm mb-4">Create a new organization, or check your email for pending invites.</span>
        <AppButton :to="{ name: 'dashboard-create-org' }">
            <div class="inline-flex items-center gap-2 pr-1">
                <Icon name="hugeicons:add-01" />
                Create organization
            </div>
        </AppButton>
    </div>
</template>