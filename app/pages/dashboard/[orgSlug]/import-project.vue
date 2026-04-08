<script setup lang="ts">
import { type ClientInsertProjectSchema } from "~~/shared/validation";

const { $csrfFetch } = useNuxtApp();
const { org, refresh: refreshProjects } = useCurrentOrg();
const router = useRouter();

async function createProject() {
    if (!org.value) return;
    if (title.value.length === 0) return;
    if (selectedRepo.value.length === 0) return;

    const [ repoOwner, repoName ] = selectedRepo.value.split('/');
    if (!repoOwner || !repoName) return;

    const body: ClientInsertProjectSchema = {
        organizationId: org.value.id,
        title: title.value,
        repoOwner,
        repoName,
    };

    const { data, error } = await tryCatch($csrfFetch<{ id: number }>('/api/projects', {
        method: 'POST',
        body,
    }));

    if (error) {
        alert(`Error importing project: ${error.message}`);
        return;
    }

    await refreshProjects();
    router.push({ 
        name: 'dashboard-orgSlug-projectId',
        params: {
            orgSlug: org.value.slug,
            projectId: data.id 
        }
    });
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
    <div class="flex flex-col w-full max-w-prose mx-auto mt-6">
        <PageHeader
            title="Import project from GitHub"
            description="Start a project that syncs with a GitHub repo. You will need to have granted Mórchlár permissions to open/track issues." />

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
                <AppButton type="submit">
                    Import
                </AppButton>
            </div>
        </form>
    </div>
</template>