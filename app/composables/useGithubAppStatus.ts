export const useGitHubAppStatus = () => {
    const { data, pending, error, refresh } = useFetch('/api/github/app/status');

    return {
        data,
        availableRepositories: computed(() => 
            data.value?.status === 'app_connected'
            ? data.value.availableRepositories ?? [] 
            : []
        ),
        pending,
        error,
        refresh
    };
}