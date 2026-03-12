<script setup lang="ts">
definePageMeta({
    sidebarType: 'user',
});

const auth = useAuth();

const {
    data: accounts,
    error: accountsFetchError,
    pending: accountsPending
} = useFetch('/api/user/get-accounts', { method: 'get' });

// const nonCredentialAccounts = computed(() => accounts.value?.filter((a) => a.providerId !== 'credential'));

const githubInfo = computed(() => accounts.value?.find((a) => a.providerId === 'github'));

const githubScopes = computed<Record<string, { name: string, granted: boolean }>>(() => ({
    'user:email': { name: 'Read account email', granted: githubInfo.value?.scopes.includes('user:email') ?? false },
    'repo': { name: 'Access repositories', granted: githubInfo.value?.scopes.includes('repo') ?? false }
}));

const linkedStatus = computed(() => {
    if (!githubInfo.value?.createdAt) return 'Unlinked';

    if (Object.values(githubScopes.value).find((s) => s.granted === false)) return 'Insufficient Permissions';

    return 'Linked!';
});
</script>

<template>
    <AccountPageWrapper>
        <div class="flex flex-col gap-2">
            <div v-if="accountsPending">
                Loading...
            </div>
            <div v-else-if="accountsFetchError">
                Error loading accounts: {{ accountsFetchError.message }}
            </div>
            <div 
                v-else
                class="flex flex-col gap-2">
                <span class="text-xl font-bold">
                    GitHub Integration
                </span>
                <div class="ring-md p-4 rounded-lg flex flex-col gap-2">
                    <span class="text-lg font-bold">
                        {{ linkedStatus }}
                    </span>
                    <div class="flex flex-row gap-2">
                        <Icon 
                            name="hugeicons:github-01"
                            :size="48"
                            class="my-auto" />
                        <div class="flex flex-col">
                            <span class="font-semibold">Permissions:</span>
                            <ul>
                                <li 
                                    v-for="scope in githubScopes"
                                    class="flex flex-row items-center justify-center gap-1"
                                    :key="scope.name">
                                    <Icon :name="scope.granted ? 'hugeicons:tick-02' : 'hugeicons:cancel-01'" />
                                    {{ scope.name }}
                                </li>
                            </ul>
                        </div>
                        <div class="ml-auto flex flex-col">
                            <ButtonPrimary 
                                v-if="linkedStatus === 'Unlinked'"
                                @click="auth.signInWithGitHub()">
                                Link Account
                            </ButtonPrimary>
                            <ButtonPrimary
                                v-else-if="linkedStatus === 'Insufficient Permissions'"
                                @click="auth.grantGitHubPermissions()">
                                Grant permissions
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AccountPageWrapper>
</template>