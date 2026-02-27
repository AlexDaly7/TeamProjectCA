<script setup lang="ts">
const auth = useAuth();
const router = useRouter();
const { $authClient } = useNuxtApp();
const groupsStore = useGroupsStore();

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
    <div class="h-full grow flex flex-col p-4">
        <span class="text-xl ">
            Hello {{ auth.user.value?.name }}
        </span>

        <h1 class="text-3xl font-bold">
            My Groups
        </h1>

        <div class="flex flex-row gap-2">
            <AppButton @click="signOut">
                Sign out
            </AppButton>
        </div>
        
        <div 
            v-if="groupsPending"
            class="mt-4 grow flex items-center justify-center">
            <Icon 
                name="hugeicons:loading-03" 
                class="animate-spin"
                size="32" />
        </div>
        <div 
            v-else-if="groupsError"
            class="mt-4 grow flex items-center justify-center">
            An error occured loading groups: {{ groupsError ?? 'Unknown Error' }}
        </div>
        <div 
            v-else
            class="h-full mt-4 grow grid gap-2 grid-cols-4 overflow-y-auto">
            <NuxtLink
                v-for="group in groups"
                :key="group.groupId"
                class="bg-main-800 flex flex-col gap-2 max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
                :to="{ name: 'dashboard-group-groupId', params: { groupId: group.groupId }  }">
                <span class="text-lg font-semibold">{{ group.group.name }}</span>
                <span class="capitalize">Role: <i>{{ group.role }}</i></span>
            </NuxtLink>
            <button
                class="bg-main-800 flex items-center justify-center max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75"
                @click="createGroup">
                <span>Create a group</span>
            </button>
        </div>
    </div>
</template>