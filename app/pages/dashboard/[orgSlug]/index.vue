<script setup lang="ts">
import { type ClientInsertProjectSchema } from '~~/lib/db/schema';

definePageMeta({
    sidebarType: 'org',
});

const { $csrfFetch } = useNuxtApp();

const {
    orgSlug,
    orgData,
    pending: orgDataPending,
    error: orgDataError,
    refresh: refreshProjects,
} = useCurrentOrg();


async function createProject() {
    if (title.value.length === 0) return;
    if (selectedRepo.value.length === 0) return;
    if (!orgData.value) return; // todo: add warnings later?

    const [ repoOwner, repoName ] = selectedRepo.value.split('/');
    if (!repoOwner || !repoName) return;

    const body: ClientInsertProjectSchema = {
        organizationId: orgData.value.organization.id,
        repo: selectedRepo.value,
        title: title.value,
        repoOwner,
        repoName,
    };

    await $csrfFetch('/api/projects', {
        method: 'POST',
        body,
    });

    refreshProjects();
}

const title = ref('');
const titleChanged = ref(false);

const selectedRepo = ref('');
function selectedRepoChanged(value: string) {
    if (titleChanged.value) return;
    const name = value.split('/')[1];
    if (name) {
        title.value = name;
    }
}
</script>

<template>
    <h1 class="text-3xl font-bold">Projects</h1>

    <div class="w-full h-0.5 my-4 bg-main-800"></div>

    <div 
        v-if="orgDataPending"
        class="mt-4 grow flex items-center justify-center">
        <LoadingIcon :size="32" />
    </div>
    <div 
        v-else-if="orgDataError || !orgData?.projects"
        class="mt-4 grow flex items-center justify-center">
        An error occured loading projects: {{ orgDataError ?? 'Unknown Error' }}
    </div>
    <div v-else class="h-full grid grid-cols-4 auto-rows-[25%] gap-2 overflow-y-auto">
        <div
            v-for="project in orgData.projects"
            :key="project.id"
            class="bg-main-800 flex flex-col justify-between min-h-40 p-4 ring-md rounded-lg">
            <div class="inline-flex justify-between">
                <div class="flex flex-col">
                    <span class="text-lg font-bold">{{ project.title }}</span>
                    <span class="text-sm text-txt-secondary">Updated x days ago</span>
                </div>
                <Icon name="hugeicons:more-horizontal" size="20" />
            </div>

            <div class="flex flex-col gap-1">
                <div class="inline-flex justify-between text-txt-secondary text-sm">
                    <span class="inline-flex items-center gap-1">
                        <Icon name="hugeicons:task-01" />
                        12 tasks
                    </span>
                    <span class="inline-flex items-center gap-1">
                        <Icon name="hugeicons:user-group" />
                        4 members
                    </span>
                </div>
                <ButtonSecondary
                    class="inline-flex justify-between items-center"
                    :to="{ name: 'dashboard-orgSlug-projectId', params: { orgSlug, projectId: project.id }  }">
                    Open
                    <Icon name="hugeicons:arrow-right-01" />
                </ButtonSecondary>
            </div>
        </div>

        <AppDialog
            title="Import project from GitHub"
            description="Start a project that syncs with a GitHub repo. You will need to have granted Mórchlár permissions to open/track issues.">
            <template #trigger>
                <button
                    class="bg-main-800 flex items-center justify-center min-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75">
                    <span>Import project from GitHub repo</span>
                </button>
            </template>
            <template #body>
                <form @submit.prevent="createProject">
                    <div class="flex flex-col gap-1">
                        <Label
                            class="text-sm text-txt-secondary"
                            for="title">
                            Project Title
                        </Label>
                        <input 
                            name="title" 
                            id="title"
                            type="text"
                            placeholder="My project..."
                            required
                            v-model="title"
                            @input="titleChanged = true"
                            class="mb-2 h-8 bg-main-700 rounded-md ring-md px-4 leading-none outline-none" />
                    </div>
                    <OrgRepoSelector 
                        label="Repository"
                        field-id="repo"
                        v-model:repo="selectedRepo"
                        @update:repo="selectedRepoChanged" />
                    <div class="flex justify-end mt-4">
                        <ButtonPrimary type="submit">
                            Import
                        </ButtonPrimary>
                    </div>
                </form>
            </template>
        </AppDialog>
    </div>
</template>