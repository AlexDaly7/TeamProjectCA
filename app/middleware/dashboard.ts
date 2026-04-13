export default defineNuxtRouteMiddleware(async (from, to) => {
    const { data, error } = await useFetch('/api/user/orgs', { method: 'get' });
    if (error.value || !data.value) return;

    // Either get the active org or the first one if there are orgs but none is active
    const slug = data.value.active?.slug ?? data.value.all[0]?.slug;

    if (slug) {
        return navigateTo(`/dashboard/${slug}`);
    }
});
