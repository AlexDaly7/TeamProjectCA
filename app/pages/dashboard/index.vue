<script setup lang="ts">
definePageMeta({
    sidebarType: 'user',
});

const auth = useAuth();
const router = useRouter();
const { $authClient } = useNuxtApp();

async function signOut() {
    await $authClient.signOut();

    router.push({ name: 'index' });
}

const organizations = $authClient.useListOrganizations();

async function createOrganization() {
    // async function promptValidSlug(): Promise<string | null> {
    //     while (true) {
    //         const slug = prompt("Enter org slug: ");
    //         if (!slug) return null;

    //         const { data, error } = await $authClient.organization.checkSlug({ slug });

    //         if (error) {
    //             alert("There was an error validating the slug. Please try again.");
    //             continue;
    //         }

    //         if (data.status) return slug;

    //         alert("That slug is already taken. Please choose another.");
    //     }
    // }

    const name = prompt("Enter organization name:");
    if (!name) return;

    const slug = prompt("Enter org slug: ");
    if (!slug) return;

    const { data, error } = await $authClient.organization.create({ name, slug });

    if (error) {
        alert(`There was an error creating this org.`);
    } else {
        alert(`Created org with ID: ${data.id}`);
    }
}
</script>

<template>
    <span class="text-xl ">
        Hello {{ auth.user.value?.name }}
    </span>

    <h1 class="text-3xl font-bold">
        My Organizations
    </h1>

    <div class="flex flex-row gap-2">
        <ButtonPrimary @click="signOut">
            Sign out
        </ButtonPrimary>
    </div>
    
    <div 
        v-if="organizations.error"
        class="mt-4 grow flex items-center justify-center">
        An error occured loading organizations: {{ organizations.error.statusText ?? 'Unknown Error' }}
    </div>
    <div 
        v-else-if="organizations.isPending"
        class="mt-4 grow flex items-center justify-center">
        <LoadingIcon :size="32" />
    </div>
    <div 
        v-else
        class="h-full mt-4 grow grid gap-2 grid-cols-4 overflow-y-auto">
        <NuxtLink
            v-for="org in organizations.data"
            :key="org.id"
            class="bg-main-800 flex flex-col gap-2 max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
            :to="{ name: 'dashboard-group-groupId', params: { groupId: org.id }  }">
            <span class="text-lg font-semibold">{{ org.name }}</span>
            <!-- <span class="capitalize">Role: <i>{{ org. }}</i></span> -->
        </NuxtLink>
        <button
            class="bg-main-800 flex items-center justify-center max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
            @click="createOrganization">
            <span>Create an organization</span>
        </button>
    </div>
</template>