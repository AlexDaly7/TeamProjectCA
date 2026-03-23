<script setup lang="ts">
import { type ClientInsertProjectSchema } from '~~/lib/db/schema';

definePageMeta({
    sidebarType: 'org',
});

const { $csrfFetch } = useNuxtApp();

const route = useRoute();
// https://nuxt.com/docs/4.x/api/composables/use-fetch#reactive-keys-and-shared-state
const orgSlug = computed(() => route.params.orgSlug);

const { 
    data: orgData,
    pending: orgDataPending,
    error: orgDataError,
    refresh: refreshProjects,
} = useFetch(() => `/api/projects/by-slug/${orgSlug.value}`, {
    method: 'GET',
});


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

    <div 
        v-if="orgDataPending"
        class="mt-4 grow flex items-center justify-center">
        <LoadingIcon :size="32" />
    </div>
    <div 
        v-else-if="orgDataError"
        class="mt-4 grow flex items-center justify-center">
        An error occured loading projects: {{ orgDataError ?? 'Unknown Error' }}
    </div>
    <div 
        v-else
        class="h-full mt-4 grow grid gap-2 grid-cols-4 overflow-y-auto">
        
        <NuxtLink
            v-for="project in orgData?.projects"
            :key="project.id"
            class="bg-main-800 flex flex-col gap-2 max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
            :to="{ name: 'dashboard-orgSlug-projectId', params: { orgSlug, projectId: project.id }  }">
            <span class="text-lg font-bold">{{ project.title }}</span>
        </NuxtLink>

        <AppDialog
            title="Import project from GitHub"
            description="Start a project that syncs with a GitHub repo. You will need to have granted Mórchlár permissions to open/track issues.">
            <template #trigger>
                <button
                    class="bg-main-800 flex items-center justify-center max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75">
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