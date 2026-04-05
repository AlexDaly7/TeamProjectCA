<script setup lang="ts">
definePageMeta({
    sidebarType: 'org',
});

const {
    orgSlug,
    org,
    orgData,
    pending: orgDataPending,
    error: orgDataError,
    refresh: refreshProjects,
    renameProject: renameProjectHelper,
    deleteProject: deleteProjectHelper
} = useCurrentOrg();

useAppHead({
    pageTitle: 'Projects',
    prefix: computed(() => org.value?.name ?? 'Loading...'),
});

const MS_PER_DAY = 86400000;
function projectLastUpdatedText(project: CurrentOrgProject): string {
    const latestDate = new Date(project.lastTaskUpdatedAt ?? project.updatedAt);

    const diff = Date.now() - latestDate.getTime();

    const daysAgo = Math.floor(diff / MS_PER_DAY);

    if (daysAgo > 1) {
        return `Updated ${daysAgo} days ago`;
    } else if (daysAgo === 1) {
        return "Updated 1 day ago";
    } else {
        return "Updated today";
    }
}

async function renameProject(project: CurrentOrgProject) {
    const newName = prompt(`Rename '${project.title}':`, project.title);
    if (!newName) return;

    if (newName.trim() === '') {
        alert('Invalid name.');
        return;
    }

    await renameProjectHelper(project, newName);
    await refreshProjects();
}

async function deleteProject(project: CurrentOrgProject) {
    const confirmation = confirm(`Are you sure you want to delete '${project.title}'? This action is irreversible.`);
    if (!confirmation) return;

    await deleteProjectHelper(project);
    await refreshProjects();
}
</script>

<template>
    <h1 class="text-3xl font-bold">Projects</h1>

    <div class="w-full h-0.5 my-4 bg-main-800"></div>

    <div 
        v-if="orgDataPending"
        class="mt-4 grow flex items-center justify-center">
        <LoadingIcon :size="32" />
    </div>
    <div 
        v-else-if="orgDataError || !orgData?.projects"
        class="mt-4 grow flex items-center justify-center">
        An error occured loading projects: {{ orgDataError ?? 'Unknown Error' }}
    </div>
    <div v-else class="h-full grid grid-cols-4 auto-rows-[30%] gap-2 overflow-y-auto">
        <div
            v-for="project in orgData.projects"
            :key="project.id"
            class="bg-main-800 flex flex-col justify-between min-h-40 p-4 ring-md rounded-lg">
            <div class="inline-flex justify-between">
                <div class="flex flex-col">
                    <span class="text-lg font-bold">{{ project.title }}</span>
                    <span class="text-sm text-txt-secondary">
                        {{ projectLastUpdatedText(project) }}
                    </span>
                </div>

                <AppDropdown>
                    <template #trigger>
                        <div class="size-8 flex items-center justify-center rounded-md cursor-pointer data-[state=open]:bg-main-700 hover:bg-main-700">
                            <Icon name="hugeicons:more-horizontal" size="20" />
                        </div>
                    </template>

                    <template #content>
                        <AppDropdownItem
                            text="Rename"
                            icon="hugeicons:edit-04"
                            @select="renameProject(project)" />
                        <AppDropdownItem
                            text="Delete"
                            icon="hugeicons:delete-02"
                            variant="danger"
                            @select="deleteProject(project)" />
                    </template>
                </AppDropdown>
            </div>

            <div class="flex flex-col gap-1">
                <span class="inline-flex items-center text-txt-secondary text-sm gap-1">
                    <Icon name="hugeicons:task-01" />
                    {{ project.totalTasks }} total tasks
                </span>

                <AppButton
                    variant="secondary"
                    class="inline-flex justify-between items-center"
                    :to="{ name: 'dashboard-orgSlug-projectId', params: { orgSlug, projectId: project.id }  }">
                    Open
                    <Icon name="hugeicons:arrow-right-01" />
                </AppButton>
            </div>
        </div>

        <ProjectPageImportFromGithubCard
            :organization-id="orgData.organization.id"
            @refresh-projects="refreshProjects"/>
    </div>
</template>