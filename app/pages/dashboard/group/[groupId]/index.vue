<script setup lang="ts">
import RepoSelector from '~/components/Group/RepoSelector.vue';
import { type ClientInsertProjectSchema } from '~~/lib/db/schema';
const { $csrfFetch } = useNuxtApp();

const route = useRoute();
// https://nuxt.com/docs/4.x/api/composables/use-fetch#reactive-keys-and-shared-state
const groupId = computed(() => route.params.groupId);

const { data: groupInfo, pending: groupInfoPending, error: groupInfoError } = useFetch(() => `/api/groups/${groupId.value}`, { method: 'GET' });

const { data: projects, pending: projectsPending, error: projectsError, refresh: refreshProjects } = useFetch(() => `/api/projects/${groupId.value}`, { method: 'GET' });

async function createProject() {
    if (title.value.length === 0) return;
    if (selectedRepo.value.length === 0) return;

    if (isNaN(Number(groupId.value))) {
        throw Error('Invalid groupId when creating project.');
    }

    const [ repoOwner, repoName ] = selectedRepo.value.split('/');
    if (!repoOwner || !repoName) return;

    const body: ClientInsertProjectSchema = {
        groupId: Number(groupId.value),
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

let userName: string = "";

async function addUserToGroup() {
    const result = await $csrfFetch('/api/groups/addUser', {
        method: 'POST',
        body: {
            userName: userName,
            groupId: Number(groupId.value)
        },
    });
    console.log(await result);
}

</script>

<template>
    <div v-if="groupInfoPending">
        <span>Selected group:</span>
        <h1 class="text-3xl font-bold animate-pulse">Loading...</h1>
        <span class="mt-4">Projects</span>
    </div>
    <div>
        <form>
            <AppFormInput
                label="Enter the name of the person you would like to add."
                placeholder="John Smith"
                name="userInput"
                v-model="userName"/>
        </form>
        <ButtonSecondary @click="addUserToGroup">Add members to group.</ButtonSecondary>
    </div>
    <div v-if="groupInfoError || !groupInfo">
        There was an error fetching group info.
    </div>
    <div v-else class="flex flex-col">
        <span>Selected group:</span>
        <h1 class="text-3xl font-bold">{{ groupInfo.name }}</h1>
        <span class="mt-4">Projects</span>
    </div>
    <div 
        v-if="projectsPending"
        class="mt-4 grow flex items-center justify-center">
        <LoadingIcon :size="32" />
    </div>
    <div 
        v-else-if="projectsError"
        class="mt-4 grow flex items-center justify-center">
        An error occured loading projects: {{ projectsError ?? 'Unknown Error' }}
    </div>
    <div 
        v-else
        class="h-full mt-4 grow grid gap-2 grid-cols-4 overflow-y-auto">
        
        <NuxtLink
            v-for="project in projects"
            :key="project.groupId"
            class="bg-main-800 flex flex-col gap-2 max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
            :to="{ name: 'dashboard-group-groupId-project-projectId', params: { groupId, projectId: project.id }  }">
            <span class="text-lg font-semibold">{{ project.title }}</span>
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
                    <RepoSelector 
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