import type { ActionButtonResult } from '~/utils/types/actionButton';

export const useCurrentOrg = () => {
    const route = useRoute();
    // https://nuxt.com/docs/4.x/api/composables/use-fetch#reactive-keys-and-shared-state
    const orgSlug = computed(() => (route.params.orgSlug ? String(route.params.orgSlug) : null));

    const { data, pending, error, refresh } = useFetch(() => `/api/projects/by-slug/${orgSlug.value}`, {
        method: 'GET',
        key: () => `org:${orgSlug.value}`,
    });

    const currentOrg = computed(() => data.value?.organization);
    const members = computed(() => data.value?.members ?? null);

    async function renameCurrentOrg(newName: string): Promise<ActionButtonResult> {
        const { $authClient } = useNuxtApp();

        if (!currentOrg.value) {
            return { error: true, message: 'No selected organization.' };
        }

        const { error } = await $authClient.organization.update({
            organizationId: currentOrg.value.id,
            data: { name: newName },
        });

        if (error) {
            return { error: true, message: error.message ?? 'An unknown error occurred.' };
        }

        return { error: false };
    }

    async function deleteCurrentOrg(): Promise<ActionButtonResult> {
        const { $authClient } = useNuxtApp();

        if (!currentOrg.value) {
            return { error: true, message: 'No selected organization.' };
        }

        const { error } = await $authClient.organization.delete({ organizationId: currentOrg.value.id });

        if (error) {
            return { error: true, message: error.message ?? 'An unknown error occurred.' };
        }

        return { error: false };
    }

    async function renameProject(project: CurrentOrgProject, newName: string): Promise<ActionButtonResult> {
        const { $csrfFetch } = useNuxtApp();

        try {
            await $csrfFetch(`/api/projects/${project.id}`, {
                method: 'PATCH',
                body: {
                    title: newName,
                },
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
        org: currentOrg,
        members,
        projects: computed(() => data.value?.projects ?? []),
        pending,
        error,
        refresh,
        renameCurrentOrg,
        deleteCurrentOrg,
        renameProject,
        deleteProject,
    };
};

export type CurrentOrgProject = NonNullable<ReturnType<typeof useCurrentOrg>['orgData']['value']>['projects'][number];
