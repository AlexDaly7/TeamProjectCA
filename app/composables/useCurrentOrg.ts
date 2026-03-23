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

    return {
        orgSlug,
        orgData: data,
        org: computed(() => data.value?.organization),
        projects: computed(() => data.value?.projects ?? []),
        pending,
        error,
        refresh
    };
}