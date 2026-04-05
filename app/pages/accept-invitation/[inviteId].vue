<script setup lang="ts">
const { $authClient } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const inviteId = route.params.inviteId;

async function acceptInvite() {
    const { data, error } = await $authClient.organization.acceptInvitation({
        invitationId: String(inviteId),
    });

    if (error) {
        alert(`Error accepting invite: ${error.message}`);
    }

    await router.push({ name: 'dashboard' });
}
</script>

<template>
    <div class="h-full grow flex flex-col gap-4 items-center justify-center">
        <span>Click the button to accept invitation.</span>
        <AppButton @click="acceptInvite">
            Accept Invitation
        </AppButton>
    </div>
</template>