<script setup lang="ts">
import type z from 'zod';
import { VSImportProject } from '~/utils/schemas/importProject';
import type { ActionButtonResult } from '~/utils/types/actionButton';
definePageMeta({
    sidebarType: 'project',
});

useAppHead({
    pageTitle: 'Settings',
    prefix: 'Project',
});


const router = useRouter();
const activeProject = useCurrentProject();
const activeOrg = useCurrentOrg();
const { refreshOrganizations } = useOrganizations();

const projectId = activeProject.currentProject.value?.id;
const currentProject = activeOrg.projects.value.find((project)=>project.id===projectId);

const validationSchema = VSImportProject.pick({ title: true });
type SchemaValues = z.infer<typeof validationSchema>;

async function deleteProject(): Promise<ActionButtonResult> {
    if(projectId===null||currentProject===undefined) return {
        error: true,
        message: "Please ensure a project is selected."
    };

    router.push({ name: 'dashboard-orgSlug', params: { orgSlug: activeOrg.orgSlug.value } });

    activeOrg.refresh();

    return activeOrg.deleteProject(currentProject);    
}

async function renameProject({ title }: SchemaValues): Promise<ActionButtonResult> {
    if(currentProject===undefined) return {
        error: true,
        message: "Please ensure a project is selected."
    };
    const result = await activeOrg.renameProject(currentProject, title);

    if (result.error) return result;

    await activeOrg.refresh(); 
    await refreshOrganizations();

    return result;
}

const initialValues = computed(() => {
    return { title: activeOrg.org.value?.name ?? '' };
});

</script>

<template>
    <FormBuilderNew
            @submit="renameProject"
            :validationSchema
            :initialValues
            :submit-btn="{
                label: 'Save'
            }"
            :fields="[
                {
                    fieldType: 'text',
                    label: 'Name',
                    name: 'title',
                    placeholder: 'New project name...',
                    required: true,
                }
            ]" />

    <SettingsCard
        variant="danger"
        :require-confirmation="true"
        :action-disabled="currentProject === undefined"
        :action="deleteProject"
        @on-success="router.push({ name: 'dashboard' })">
        <template #title>
            Delete Project
        </template>
        <template #description>
            Permanently remove this project from Mórchlár. This action is not reversible.
        </template>
        <template #action>
            Delete Project
        </template>
    </SettingsCard>
</template>