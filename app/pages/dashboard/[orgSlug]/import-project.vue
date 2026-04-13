<script setup lang="ts">
import z from 'zod';
import { VSImportProject } from '~/utils/schemas/importProject';
import type { ActionButtonResult } from '~/utils/types/actionButton';
import { type ClientInsertProjectSchema } from '~~/shared/validation';

const { $csrfFetch } = useNuxtApp();
const { org, refresh: refreshProjects } = useCurrentOrg();
const router = useRouter();

const validationSchema = VSImportProject;

async function onSubmit(values: z.infer<typeof validationSchema>): Promise<ActionButtonResult> {
    if (!org.value) return { error: true, message: 'Error: No organization selected.' };

    const body: ClientInsertProjectSchema = {
        organizationId: org.value.id,
        title: values.title,
        repo: values.repo,
    };

    const { data, error } = await tryCatch(
        $csrfFetch<{ id: number }>('/api/projects', {
            method: 'POST',
            body,
        }),
    );

    if (error) {
        return { error: true, message: error.message };
    }

    await refreshProjects();
    router.push({
        name: 'dashboard-orgSlug-projectId',
        params: {
            orgSlug: org.value.slug,
            projectId: data.id,
        },
    });

    return { error: false };
}

const { data, pending, error, availableRepositories: repos } = useGitHubAppStatus();

const selectItems = computed(() => {
    const list = repos.value.map((repo) => ({
        value: `${repo.owner}/${repo.repo}`,
        label: `${repo.owner}/${repo.repo}`,
        iconUrl: repo.image,
    }));

    const pendingText = pending.value ? 'Loading repos...' : undefined;
    const errorText = (() => {
        if (data.value?.status !== 'app_connected') return 'App not installed. Check settings for more info.';

        return error.value?.message;
    })();

    return {
        list,
        pendingText,
        errorText,
    };
});
</script>

<template>
    <div class="flex flex-col w-full max-w-prose mx-auto mt-6">
        <HeadersPage
            title="Import project from GitHub"
            description="Start a project that syncs with a GitHub repo. You will need to have granted Mórchlár permissions to open/track issues." />

        <FormBuilderNew
            @submit="onSubmit"
            :validationSchema
            :submitBtn="{
                label: 'Import',
            }"
            :fields="[
                {
                    fieldType: 'text',
                    label: 'Project Title',
                    name: 'title',
                    placeholder: 'My project...',
                    required: true,
                    watcher: ({ repo }) => repo.split('/')[1] ?? '',
                },
                {
                    fieldType: 'select',
                    label: 'Repository',
                    name: 'repo',
                    placeholder: 'Select a repo...',
                    required: true,
                    selectItems,
                },
            ]" />
    </div>
</template>
