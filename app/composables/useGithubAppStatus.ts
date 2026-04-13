export const useGitHubAppStatus = () => {
    const { data, pending, error, refresh } = useFetch('/api/github/status');

    return {
        data,
        availableRepositories: computed(() =>
            data.value?.status === 'app_connected' ? (data.value.availableRepositories ?? []) : [],
        ),
        pending,
        error,
        refresh,
    };
};
