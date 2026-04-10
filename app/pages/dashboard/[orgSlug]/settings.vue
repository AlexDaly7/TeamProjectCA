<script setup lang="ts">
import type z from 'zod';
import { VSImportProject } from '~/utils/schemas/importProject';
import type { ActionButtonResult } from '~/utils/types/actionButton';

definePageMeta({
    sidebarType: 'org',
});

const router = useRouter();
const activeOrg = useCurrentOrg();
const { refreshOrganizations } = useOrganizations();

useAppHead({
    pageTitle: 'Settings',
    prefix: computed(() => activeOrg.org.value?.name ?? 'Loading...'),
});

const validationSchema = VSImportProject.pick({ title: true });
type SchemaValues = z.infer<typeof validationSchema>;

async function deleteOrg() {
    return activeOrg.deleteCurrentOrg();
}

async function renameOrg({ title }: SchemaValues): Promise<ActionButtonResult> {
    const result = await activeOrg.renameCurrentOrg(title);

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
    <HeadersPage
        title="Settings"
        description="Organization settings." />
    
    <div 
        class="flex flex-col gap-8 md:p-4"
        :key="activeOrg.org.value?.id">
        <FormBuilderNew
            @submit="renameOrg"
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
                    placeholder: 'New org name...',
                    required: true,
                }
            ]" />
    </div>
</template>