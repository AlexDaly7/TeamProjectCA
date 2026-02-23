<script setup lang="ts">
const auth = useAuth();
const router = useRouter();
const { $authClient } = useNuxtApp();
const groupsStore = useGroupsStore();

async function addProject(title: string) {
    await $fetch("/api/project", {
        method: "POST",
        body: { title }
    });
}

const { data: repos, pending, error } = useFetch('/api/github/repos', { lazy: true });

async function signOut() {
    await $authClient.signOut();

    router.push({ name: 'index' });
}

async function createGroup() {
    const name = prompt("Enter group name:");
    if (!name) return;

    console.log(name);

    const id = await groupsStore.createGroup(name);

    alert(`Created group with ID: ${id}`);
}

const { data: groups, pending: groupsPending, error: groupsError } = useFetch('/api/groups', { method: 'GET' })
</script>

<template>
    <div>
        <button v-on:click="addProject('Hi!')">Create Project</button>
        
    </div>

    <span>
        Hello
        <span>
            {{ auth.user.value?.name }}
        </span>
    </span>

    <div class="flex flex-row gap-2">
        <AppButton @click="signOut">
            Sign out
        </AppButton>

        <AppButton @click="createGroup">
            Create group
        </AppButton>
    </div>

    <div v-if="groupsPending">
        Loading groups...
    </div>
    <div v-else-if="groupsError">
        Groups error: {{ groupsError }}
    </div>
    <div v-else>
        {{ groups }}
    </div>

    <h1 class="text-3xl font-bold">My Repos</h1>
    <div v-if="pending">
        Loading...
    </div>
    <div v-else-if="error">
        Error: {{ error }}
    </div>
    <ul 
        v-else
        class="flex flex-col gap-2 p-4 max-h-80 overflow-auto">
        <li
            v-for="repo in repos"
            :key="repo.id"
            class="w-full flex flex-col bg-slate-800 p-2 ring-1 ring-slate-50/10 ring-inset rounded-lg">
            <div class="flex flex-row gap-2 items-center">
                <img 
                    :src="repo.owner.avatar"
                    class="size-5 rounded-full">
                <span class="text-sm">{{ repo.owner.name }}</span>
            </div>
            <NuxtLink 
                :to="{ name: 'dashboard-repo-id', params: { id: repo.id } }"
                class="text-lg hover:underline">
                {{ repo.name }}
            </NuxtLink>
        </li>
    </ul>
</template>