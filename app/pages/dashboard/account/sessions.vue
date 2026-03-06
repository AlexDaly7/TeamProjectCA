<script setup lang="ts">

definePageMeta({
    sidebarType: 'user',
});

const { $authClient, $authSession } = useNuxtApp();

const sessionsResponse = await $authClient.listSessions();

const currentSession = computed(() => 
    sessionsResponse.data?.find((session) => session.token === $authSession.data.value?.session.token));

const otherSessions = computed(() => 
    sessionsResponse.data?.filter((s) => s.id !== currentSession.value?.id) ?? []);


function revokeSession(token: string) {
    $authClient.revokeSession({ token });
}

function revokeOtherSessions(token: string) {
    $authClient.revokeOtherSessions();
}
</script>

<template>
    <div class="flex flex-col max-w-full md:max-w-3xl w-full mx-auto">
        <AccountNav />
        <div class="flex flex-col gap-2 mt-8">
            <div v-if="!sessionsResponse.data && !sessionsResponse.error">
                Loading...
            </div>
            <div v-else-if="sessionsResponse.error">
                Error loading sessions: {{ sessionsResponse.error.message }}
            </div>
            <div v-else class="flex flex-col gap-2">
                <template v-if="currentSession">
                    <span class="text-xl font-bold">Current Session</span>
                    <SessionListItem
                        :session="currentSession"
                        :is-current-session="true" />
                </template>
                <div class="flex flex-row justify-between my-2 items-center">
                    <span class="text-xl font-bold">Other Active Sessions</span>
                    <ButtonDanger @click="revokeOtherSessions">
                        Revoke Other Sessons
                    </ButtonDanger>
                </div>
                <SessionListItem
                    v-for="session in otherSessions"
                    :key="session.id"
                    :session
                    @revoke-session="revokeSession(session.token)" />
            </div>
        </div>
    </div>
</template>