export const useOrganizations = () => {
    const { data, pending, error, refresh } = useFetch('/api/user/orgs', {
        method: 'GET',
        key: 'orgs',
    });

    return {
        organizations: data,
        organizationsPending: pending,
        organizationsError: error,
        refreshOrganizations: refresh,
    };
}