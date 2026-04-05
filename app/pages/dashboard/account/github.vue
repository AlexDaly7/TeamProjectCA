<script setup lang="ts">
definePageMeta({
    sidebarType: 'user',
});

useAppHead({
    pageTitle: 'GitHub',
    prefix: 'Settings',
});

const {
    data,
    availableRepositories,
    pending,
    error
} = useGitHubAppStatus();

</script>

<template>
    <AccountPageWrapper>
        <div class="flex flex-col gap-2">
            <div v-if="pending">
                Loading...
            </div>
            <div v-else-if="error || !data">
                Error loading GitHub integration info: {{ error?.message ?? 'An unknown error occurred' }}
            </div>
            <div 
                v-else
                class="flex flex-col gap-2">
                <div class="ring-md p-4 rounded-lg flex flex-col gap-2 relative">
                    <div class="inline-flex items-center gap-2">
                        <Icon name="hugeicons:link-01" />
                        <span class="text-lg font-bold">GitHub Integration</span>
                        <AppButton
                            class="ml-auto"
                            :href="data.manageUrl">
                            Manage ↗
                        </AppButton>
                    </div>

                    <ul class="flex flex-col gap-2 ml-2 *:gap-2 *:inline-flex *:items-center">
                        <template v-if="data.status === 'not_connected'">
                            <li>
                                <Icon name="hugeicons:cancel-01" />
                                <span>OAuth not connected</span>
                            </li>
                        </template>

                        <template v-else-if="data.status === 'oauth_connected'">
                            <li>
                                <Icon name="hugeicons:tick-01" />
                                <span>OAuth Connected</span>
                            </li>
                            <li>
                                <Icon name="hugeicons:cancel-01" />
                                <span>App not installed on account</span>
                            </li>
                        </template>

                        <template v-else-if="data.status === 'app_connected'">
                            <li>
                                <Icon name="hugeicons:tick-01" />
                                <span>OAuth Connected</span>
                            </li>
                            <li>
                                <Icon name="hugeicons:tick-01" />
                                <span>App installed</span>
                            </li>
                            <li>
                                Repository selection type: {{ 
                                    data.selectedRepositories === 'all' 
                                    ? 'All repositories'
                                    : 'Only selection'
                                }}
                            </li>
                            <li class="flex flex-col items-start!">
                                Available repositories ({{ availableRepositories.length }}):
                                <ul class="ml-4 list-disc list-inside">
                                    <li
                                        v-for="repo in availableRepositories"
                                        :key="`${repo.owner}/${repo.repo}`">
                                        {{ repo.owner }}/{{ repo.repo }}
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
    </AccountPageWrapper>
</template>