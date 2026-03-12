export default defineNuxtRouteMiddleware(async (from, to) => {
    const { data, error } = await useFetch('/api/user/orgs', { method: 'get' });

    if (error.value || !data.value || data.value.active === null) return;

    return navigateTo(`/dashboard/${data.value.active.slug}`);
});