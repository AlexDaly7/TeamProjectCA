<script setup lang="ts">
definePageMeta({
    sidebarType: 'user',
});

const { $authClient } = useNuxtApp();

async function deleteAccount() {
    try {
        const { error } = await $authClient.deleteUser({
            callbackURL: '/',
        });

        if (error) {
            return {
                error: true,
                message: error.message ?? 'An error occurred deleting your account. Try again later.',
            }
        }

        navigateTo('/');

        return {
            error: false,
            message: 'Account deleted sucessfully.',
        };
    } catch (e) {
        console.error(e);

        return {
            error: true,
            message: 'An error occurred deleting your account. Try again later.'
        }
    }
}

</script>

<template>
    <AccountPageWrapper>
        <AppActionButton
            :action="deleteAccount"
            :require-are-you-sure="true"
            :variant="'danger'">
            <template #trigger>
                Delete Account
            </template>
        </AppActionButton>
    </AccountPageWrapper>
</template>