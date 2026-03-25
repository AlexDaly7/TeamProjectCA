<script setup lang="ts">
// https://github.com/nuxt/nuxt/issues/10545#issuecomment-1175012962
import { NuxtLink } from '#components';

const organizationsStore = useOrganizationsStore();

await callOnce('organizationsStore', () => organizationsStore.fetchOrganizations());

const {
    orgData,
    pending: orgDataPending,
    error: orgDataError
} = useCurrentOrg();

const {
    currentProjectId,
    currentProject,
} = useCurrentProject();

const route = useRoute();

const orgSlug = computed(() => route.params.orgSlug);

const sidebarType = computed(() => route.meta.sidebarType);

</script>

<template>
    <div class="w-full min-h-dvh max-h-dvh overflow-hidden flex flex-row">
        <aside class="min-w-3xs max-w-3xs bg-main-800 border-r border-main-50/10 flex flex-col">
            <div class="flex items-center justify-center px-2 min-h-14 border-b border-main-50/10">
                <NavbarOrgsDropdown />
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
                <AppPopover>
                    <template #trigger>
                        <ButtonTertiary
                            class="inline-flex gap-2 items-center text-sm font-medium"
                            :class="{
                                'text-txt-secondary': !currentProject,
                            }">
                            <span>{{ currentProject ? currentProject.title : 'All Projects' }}</span>
                            <Icon name="hugeicons:arrow-up-down" />
                        </ButtonTertiary>
                    </template>

                    <template #content="{ close }">
                        <div class="p-1 min-w-48 flex flex-col gap-1">
                            <span v-if="orgDataPending || !orgData?.projects">
                                Loading...
                            </span>
                            <template v-else>
                                <NuxtLink
                                    v-for="project in orgData?.projects"
                                    class="w-full outline-none inline-flex gap-1.5 items-center p-2 hover:bg-main-600 rounded-lg select-none cursor-pointer focus:ring-1 focus:ring-main-50"
                                    :text="project.title"
                                    :to="{ 
                                        name: 'dashboard-orgSlug-projectId',
                                        params: { orgSlug, projectId: project.id }
                                    }"
                                    @click="close">
                                    {{ project.title }}
                                </NuxtLink>
                            </template>
                        </div>
                    </template>
                </AppPopover>

                <template v-if="currentProjectId">
                    <div class="w-px h-full bg-main-50/10"></div>
                    <ButtonTertiary
                        class="flex items-center justify-center p-2!"
                        
                        :to="{ name: 'dashboard-orgSlug', params: { orgSlug } }">
                        <Icon name="hugeicons:cancel-01" />
                    </ButtonTertiary>
                </template>
            </nav>
            <main class="grow flex flex-col p-2 overflow-y-auto">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>