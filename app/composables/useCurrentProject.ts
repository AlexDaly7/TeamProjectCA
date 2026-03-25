export const useCurrentProject = () => {
    const route = useRoute();

    const currentProjectId = computed(() => route.params.projectId ? String(route.params.projectId) : null);

    const currentProject = computed(() => {
        if (!currentProjectId.value) return null;
        const parsedId = parseInt(currentProjectId.value);

        return useCurrentOrg().projects.value.find((p) => p.id === parsedId) ?? null;
    });

    return {
        currentProjectId,
        currentProject,
    };
}