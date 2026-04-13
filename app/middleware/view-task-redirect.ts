export default defineNuxtRouteMiddleware(async (from, to) => {
    const route = useRoute();
    const projectId = route.params.projectId;

    if (!projectId || isNaN(Number(projectId))) {
        return navigateTo('/error');
    }

    const { data, error } = await useFetch(`/api/projects/${projectId}`, { method: 'get' });
    if (error.value || !data.value) {
        return navigateTo('/error');
    }

    return navigateTo(`/dashboard/${data.value.organization.slug}/${projectId}`);
});
