export const useGroupsStore = defineStore('useGroupsStore', () => {
    const { $csrfFetch } = useNuxtApp();

    async function createGroup(name: string) {
        console.log('Creating group with name', name);

        const { id } = await $csrfFetch('/api/groups', {
            method: 'POST',
            body: { 
                name: name
            }
        });

        return id;
    }

    return {
        createGroup,
    }
});