<script setup lang="ts">
const { $authClient } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const inviteId = route.params.inviteId;

const { data, pending, error } = useFetch(`/api/invitations/${inviteId}`);

const accepting = ref(false);

async function acceptInvite() {
    accepting.value = true;
    const { error } = await $authClient.organization.acceptInvitation({
        invitationId: String(inviteId),
    });

    if (error) {
        accepting.value = false;
        alert(`Error accepting invite: ${error.message}`);
        return;
    }

    await router.push({ name: 'dashboard' });
}
</script>

<template>
    <div class="h-full grow flex flex-col gap-4 items-center justify-center">
        <div v-if="pending">
            <LoadingIcon />
        </div>
        <div v-else-if="error || !data">
            Error fetching invite data: {{ error?.statusText ?? 'Unknown error' }}
        </div>
        <div 
            v-else
            class="ring-md bg-main-800 p-4 rounded-lg flex flex-col gap-2 min-w-md">
            <h1 class="text-3xl font-bold">Accept Invite</h1>
            <span>Joining '<b>{{ data.organizationName }}</b>' as role <b class="capitalize">{{ data.role }}</b>.</span>
            <p class="text-sm text-txt-secondary">Click the button to accept invitation.</p>
            <AppButton
                class="mt-8"
                :loading="accepting"
                @click="acceptInvite">
                Accept Invitation
            </AppButton>
        </div>
    </div>
</template>