<script setup lang="ts">

definePageMeta({
    sidebarType: 'user',
});

const { $authClient, $authSession } = useNuxtApp();

const {
    data: sessions,
    error: sessionFetchError,
    pending: sessionsPending
} = useFetch('/api/user/get-sessions', { method: 'get' });


const currentSession = computed(() => 
    sessions.value?.find((s) => s.token === $authSession.data.value?.session.token));

const otherSessions = computed(() => 
    sessions.value?.filter((s) => s.id !== currentSession.value?.id) ?? []);


function revokeSession(token: string) {
    $authClient.revokeSession({ token });
}

function revokeOtherSessions() {
    $authClient.revokeOtherSessions();
}
</script>

<template>
    <AccountPageWrapper>
        <div class="flex flex-col gap-2">
            <div v-if="sessionsPending">
                Loading...
            </div>
            <div v-else-if="sessionFetchError">
                Error loading sessions: {{ sessionFetchError.message }}
            </div>
            <div 
                v-else
                class="flex flex-col gap-2">
                <template v-if="currentSession">
                    <span class="text-xl font-semibold">Current Session</span>
                    <SessionListItem
                        :session="currentSession"
                        :is-current-session="true" />
                </template>

                <div class="flex flex-row justify-between my-2 items-center">
                    <span class="text-xl font-semibold">Other Active Sessions</span>
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
    </AccountPageWrapper>
</template>