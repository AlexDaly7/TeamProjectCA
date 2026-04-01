<script setup lang="ts">
import type { ClientInsertProjectSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();

const props = defineProps<{
    organizationId: string,
}>();

const emit = defineEmits<{
    refreshProjects: [],
}>();

async function createProject() {
    if (title.value.length === 0) return;
    if (selectedRepo.value.length === 0) return;

    const [ repoOwner, repoName ] = selectedRepo.value.split('/');
    if (!repoOwner || !repoName) return;

    const body: ClientInsertProjectSchema = {
        organizationId: props.organizationId,
        repo: selectedRepo.value,
        title: title.value,
        repoOwner,
        repoName,
    };

    await $csrfFetch('/api/projects', {
        method: 'POST',
        body,
    });

    emit('refreshProjects');
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
    <div class="flex flex-col items-center justify-center min-h-40 p-4 gap-2 bg-main-800 rounded-lg border border-dashed border-main-50/10">
        <Icon name="hugeicons:github-01" size="24" />
        <span class="text-lg font-bold">Import from GitHub</span>
        <span class="text-sm text-txt-secondary">Connect a repo to get started</span>
        
        <AppDialog
            title="Import project from GitHub"
            description="Start a project that syncs with a GitHub repo. You will need to have granted Mórchlár permissions to open/track issues.">
            
            <template #trigger>
                <ButtonSecondary>
                    Import
                </ButtonSecondary>
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