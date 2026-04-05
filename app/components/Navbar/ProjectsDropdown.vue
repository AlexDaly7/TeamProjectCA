<script setup lang="ts">
const {
    orgData,
    orgSlug,
    pending: orgDataPending,
} = useCurrentOrg();

const {
    currentProjectId,
    currentProject,
} = useCurrentProject();

</script>

<template>
    <AppPopover v-if="orgSlug">
        <template #trigger>
            <AppButton
                variant="tertiary-sidebar"
                size="sm"
                class="inline-flex gap-2 items-center"
                :class="{
                    'text-txt-primary!': currentProject,
                }">
                <span>{{ currentProject ? currentProject.title : 'All Projects' }}</span>
                <Icon name="hugeicons:arrow-up-down" />
            </AppButton>
        </template>

        <template #content="{ close }">
            <div class="min-w-68">
                <div class="flex flex-col gap-2 p-2">
                    <template v-if="orgDataPending || !orgData?.projects">
                        Loading...
                    </template>
                    <template v-else>
                        <AppButton 
                            v-for="project in orgData.projects"
                            variant="tertiary"
                            size="sm-even"
                            class="flex justify-between items-center rounded-lg!"
                            exact-active-class="text-txt-primary!"
                            :key="project.id"
                            :to="{ name: 'dashboard-orgSlug-projectId', params: { orgSlug, projectId: project.id } }"
                            @click="close">
                            <div class="inline-flex gap-2">
                                <!-- <img
                                    class="size-6"
                                    :src="project."
                                    referrerpolicy="no-referrer"
                                    :alt="`Icon for ${project.title}`" /> -->
                                <span>{{ project.title }}</span>
                            </div>
                            <Icon 
                                v-if="project.id === Number(currentProjectId)"
                                name="hugeicons:tick-02"
                                size="16" />
                        </AppButton>
                    </template>
                </div>

                <template v-if="currentProjectId">
                    <div class="w-full h-px bg-main-50/10"></div>

                    <div class="p-2">
                        <!-- todo: link to project creation page -->
                        <AppButton
                            variant="tertiary"
                            size="md"
                            class="w-full inline-flex items-center gap-2 rounded-lg!"
                            :to="{ name: 'dashboard-orgSlug', params: { orgSlug } }"
                            @click="close">
                            <Icon 
                                name="hugeicons:grid-view"
                                size="20"/>
                            <div class="flex flex-col items-start">
                                <span>
                                    All Projects
                                </span>
                                <span class="text-xs text-txt-secondary">
                                    View all projects in this org.
                                </span>
                            </div>
                        </AppButton>
                    </div>
                </template>
            </div>
        </template>
    </AppPopover>

    <template v-if="currentProjectId">
        <div class="w-px h-full bg-main-50/10"></div>
        <AppButton
            variant="tertiary-sidebar"
            size="md-even"
            class="flex items-center justify-center"
            :to="{ name: 'dashboard-orgSlug', params: { orgSlug } }">
            <Icon name="hugeicons:cancel-01" />
        </AppButton>
    </template>
</template>