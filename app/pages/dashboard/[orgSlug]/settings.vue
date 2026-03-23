<script setup lang="ts">
definePageMeta({
    sidebarType: 'org',
});

const router = useRouter();

const organizationsStore = useOrganizationsStore();
const activeOrg = useCurrentOrg();

async function deleteOrg() {
    if (!activeOrg.org.value?.id) {
        // This should't run since the button will be disabled
        return { error: true, message: 'No selected org.' }; 
    }

    return organizationsStore.deleteOrganization(activeOrg.org.value.id);
}

async function renameOrg() {
    if (!activeOrg.org.value?.id) {
        // This should't run since the button will be disabled
        return { error: true, message: 'No selected org.' }; 
    }

    return organizationsStore.renameOrganization(activeOrg.org.value.id, newOrgName.value);
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
            :action="renameOrg">
            <template #title>
                Organization Name
            </template>
            <template #description>
                This is your organization's visible name within Mórchlár.
            </template>
            <template #form>
                <AppInput 
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
                Permanently delete this organization from Mórchlár. This action is not reversible.
            </template>
            <template #action>
                Delete Organization
            </template>
        </SettingsCard>
    </div>
</template>