<script setup lang="ts">
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

async function deleteOrg() {
    return activeOrg.deleteCurrentOrg();
}

async function renameOrg() {
    return activeOrg.renameCurrentOrg(newOrgName.value);
}

function onRename() {
    activeOrg.refresh(); 
    refreshOrganizations();
}

const newOrgName = ref<string>('');
watch(activeOrg.org, (value) => {
    newOrgName.value = value?.name ?? '';
});
</script>

<template>
    <div class="flex flex-col gap-8 md:p-4">
        <SettingsCard
            :action-disabled="activeOrg.org.value === undefined || newOrgName === activeOrg.org.value.name"
            :action="renameOrg"
            @on-success="onRename">
            <template #title>
                Organization Name
            </template>
            <template #description>
                This is your organization's visible name within Mórchlár.
            </template>
            <template #form>
                <FormBuilderInput
                    name="name"
                    placeholder="New org name..."
                    v-model="newOrgName" />
            </template>
            <template #action>
                Save
            </template>
        </SettingsCard>

        <SettingsCard
            variant="danger"
            :require-confirmation="true"
            :action-disabled="activeOrg.org.value === undefined"
            :action="deleteOrg"
            @on-success="router.push({ name: 'dashboard' })">
            <template #title>
                Delete Organization
            </template>
            <template #description>
                Permanently remove this organization from Mórchlár. This action is not reversible.
            </template>
            <template #action>
                Delete Organization
            </template>
        </SettingsCard>
    </div>
</template>