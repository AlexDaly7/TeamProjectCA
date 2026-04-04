<script setup lang="ts">
const { orgSlug } = useCurrentOrg();

const route = useRoute();
const sidebarType = computed(() => route.meta.sidebarType);

const { $authClient } = useNuxtApp();
const activeOrg = $authClient.useActiveOrganization();

// If on the client
if (import.meta.client) {
    watch([ orgSlug, () => activeOrg.value.data?.slug ?? null ],
        async ([currentOrgSlug, activeOrgSlug]) => {
            // Watch for changes in the org slug from the route and the active org slug from the auth client.
            if (!currentOrgSlug || currentOrgSlug === activeOrgSlug) return;
            await $authClient.organization.setActive({ organizationSlug: currentOrgSlug });
        },
    { 
        immediate: true
    });
}

const inOrgsPage = computed(() => sidebarType.value === 'org' || sidebarType.value === 'project');

</script>

<template>
    <div class="w-full min-h-dvh max-h-dvh overflow-hidden flex flex-row">
        <aside class="min-w-3xs max-w-3xs bg-main-800 border-r border-main-50/10 flex flex-col">
            <div class="flex items-center justify-center px-2 min-h-14 border-b border-main-50/10">
                <NavbarOrgsDropdown v-if="inOrgsPage" />
                <SidebarLink
                    v-else
                    :to="{ name: 'dashboard' }"
                    label="Back"
                    icon="hugeicons:arrow-left-01"
                    class="w-full px-2!" />
            </div>
            
            <div class="flex flex-col gap-2 p-2">
                <UserSidebar v-if="sidebarType === 'user'" />
                <OrgSidebar v-else-if="sidebarType === 'org'" />
                <ProjectSidebar v-else-if="sidebarType === 'project'" />
            </div>

            <div class="p-2 mt-auto border-t border-main-50/10">
                <SidebarAccountCard />
            </div>
        </aside>

        <div class="grow flex flex-col min-h-14">
            <nav 
                class="flex flex-row gap-2 p-2 min-h-14
                bg-main-800 border-b border-main-50/10">
                <NavbarProjectsDropdown v-if="inOrgsPage" />
            </nav>
            <main class="grow flex flex-col p-2 overflow-y-auto">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>