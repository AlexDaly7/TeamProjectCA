import type { ActionButtonResult } from "~/utils/types/actionButton";

export const useCurrentOrg = () => {
    const route = useRoute();
    // https://nuxt.com/docs/4.x/api/composables/use-fetch#reactive-keys-and-shared-state
    const orgSlug = computed(() => route.params.orgSlug ? String(route.params.orgSlug) : null);

    const { data, pending, error, refresh } = useFetch(
        () => `/api/projects/by-slug/${orgSlug.value}`, 
        {
            method: 'GET',
            key: () => `org:${orgSlug.value}`,
        }
    );

    async function renameProject(project: CurrentOrgProject, newName: string): Promise<ActionButtonResult> {
        const { $csrfFetch } = useNuxtApp();
        
        try {
            await $csrfFetch(`/api/projects/${project.id}`, { 
                method: 'PATCH',
                body: {
                    title: newName,
                }
            });
            return { error: false }; 
        } catch (error) {
            return { error: true, message: 'Error renaming project.' };
        }
    }

    async function deleteProject(project: CurrentOrgProject): Promise<ActionButtonResult> {
        const { $csrfFetch } = useNuxtApp();

        try {
            await $csrfFetch(`/api/projects/${project.id}`, { 
                method: 'DELETE',
            });
            return { error: false }; 
        } catch (error) {
            return { error: true, message: 'Error deleting project.' };
        }
    }

    return {
        orgSlug,
        orgData: data,
        org: computed(() => data.value?.organization),
        projects: computed(() => data.value?.projects ?? []),
        pending,
        error,
        refresh,
        renameProject,
        deleteProject,
    };
}

export type CurrentOrgProject = NonNullable<ReturnType<typeof useCurrentOrg>['orgData']['value']>['projects'][number];