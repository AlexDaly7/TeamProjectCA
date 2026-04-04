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
            <div class="min-w-68">
                <div class="flex flex-col gap-2 p-2">
                    <template v-if="orgDataPending || !orgData?.projects">
                        Loading...
                    </template>
                    <template v-else>
                        <ButtonTertiary 
                            v-for="project in orgData.projects"
                            bg-level="700"
                            class="inline-flex justify-between items-center px-2! text-sm rounded-lg!"
                            exact-active-class=""
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
                                class="text-txt-secondary" />
                        </ButtonTertiary>
                    </template>
                </div>

                <!-- <div class="w-full h-px bg-main-50/10 mb-2"></div>

                <div class="p-2">
                    todo: link to project creation page
                    <ButtonCreateOrg @on-submit="close" >
                        <ButtonTertiary
                            bg-level="700"
                            class="w-full inline-flex items-center px-2! gap-2">
                            <Icon 
                                name="hugeicons:add-01"
                                size="20"
                                class="text-txt-secondary" />
                            <div class="flex flex-col items-start">
                                <span>
                                    Create new organization
                                </span>
                                <span class="text-xs text-txt-secondary">
                                    Collaborate with a team
                                </span>
                            </div>
                        </ButtonTertiary>
                    </ButtonCreateOrg>
                </div> -->
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
</template>