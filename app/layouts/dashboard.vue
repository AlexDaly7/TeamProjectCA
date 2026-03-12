<script setup lang="ts">
// const { $authSession } = useNuxtApp();

// const selectedGroup = computed(() => $authSession.data.value?.user.selectedGroup);
// const selectedProject = computed(() => $authSession.data.value?.user.selectedProject);

const organizationsStore = useOrganizationsStore();

await callOnce('organizationsStore', () => organizationsStore.fetchOrganizations());


const route = useRoute();

const orgSlug = computed(() => route.params.orgSlug);
const projectId = computed(() => route.params.projectId);

const sidebarType = computed(() => route.meta.sidebarType);

</script>

<template>
    <div class="w-full min-h-dvh max-h-dvh overflow-hidden flex flex-row">
        <aside class="min-w-3xs bg-main-800 border-r border-main-50/10 p-2 flex flex-col justify-between">
            <div class="flex flex-col gap-2">
                <NavbarOrgsDropdown />
                <UserSidebar v-if="sidebarType === 'user'" />
                <OrgSidebar v-else-if="sidebarType === 'org'" />
                <ProjectSidebar v-else-if="sidebarType === 'project'" />
            </div>

            <SidebarAccountCard />
        </aside>

        <div class="grow flex flex-col min-h-0">
            <nav 
                class="flex flex-row gap-2 p-2
                bg-main-800 ring-1 ring-inset ring-main-50/10">
                <ButtonSecondary
                    v-if="projectId"
                    class="inline-flex items-center gap-2"
                    :to="{ name: 'dashboard-orgSlug', params: { orgSlug } }">
                    <Icon name="hugeicons:arrow-left-01" />
                    Projects
                </ButtonSecondary>
                <ButtonSecondary
                    v-else
                    class="inline-flex items-center gap-2"
                    disabled>
                    All Projects
                </ButtonSecondary>
            </nav>
            <main class="grow flex flex-col p-2 overflow-y-auto">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>