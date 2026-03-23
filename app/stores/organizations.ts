import type { Organization } from 'better-auth/plugins';
import { defineStore } from 'pinia';
import type { ActionButtonResult } from '~/utils/types/actionButton';
import type { auth } from '~~/lib/auth';

type FullOrganization = NonNullable<Awaited<ReturnType<typeof auth.api.getFullOrganization>>>;

export const useOrganizationsStore = defineStore('organizations', () => {
    const fetchWithCookies = useRequestFetch();

    const organizations = ref<{ active: FullOrganization, all: Organization[] } | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchOrganizations() {
        loading.value = true;
        error.value = null;
        
        try {
            organizations.value = await fetchWithCookies('/api/user/orgs', { method: 'GET' });
        } catch (err) {
            if (err instanceof Error) {
                error.value = err.message;
            } else {
                error.value = String(err);
            }
        } finally {
            loading.value = false;
        }
    }

    async function deleteOrganization(organizationId: string): Promise<ActionButtonResult> {
        const { $authClient } = useNuxtApp();

        const { error } = await $authClient.organization.delete({ organizationId });
        if (error) {
            return { error: true, message: error.message ?? 'An unknown error occurred.' };
        }

        return { error: false };
    }

    async function renameOrganization(organizationId: string, name: string) {
        const { $authClient } = useNuxtApp();

        const { error } = await $authClient.organization.update({
            organizationId,
            data: { name }
        });

        if (error) {
            return { error: true, message: error.message ?? 'An unknown error occurred.' };
        }

        return { error: false };
    }

    return {
        organizations,
        loading,
        error,
        fetchOrganizations,
        deleteOrganization,
        renameOrganization
    }
});
