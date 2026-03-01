<script setup lang="ts">
import type { InsertGroupMember } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();
const route = useRoute();

const groupId = computed(() => route.params.groupId);

// todo: fix this later
type GroupMembersResponse = {
    role: "owner" | "developer" | "reader";
    user: {
        id: string;
        name: string;
        image: string | null;
    };
}[]

const { data: groupMembers, pending: groupMembersPending, error: groupMembersError } = await useFetch<GroupMembersResponse>(`/api/groups/${groupId.value}/members`, { method: 'get', lazy: true });

const userName = ref<string>("");
async function addUserToGroup() {
    const body: InsertGroupMember = {
        groupId: Number(groupId.value),
        userName: userName.value,
        role: 'developer',
    };

    const result = await $csrfFetch('/api/groups/addUser', {
        method: 'POST',
        body,
    });
    console.log(await result);
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <!-- todo: use vee validate -->
        <form @submit.prevent="addUserToGroup">
            <AppFormInput
                label="Enter the name of the person you would like to add."
                placeholder="John Smith"
                name="userInput"
                v-model="userName"/>
            <ButtonSecondary type="submit">Add members to group.</ButtonSecondary>
        </form>
        <div v-if="groupMembersError">
            Error loading group members: {{ groupMembersError.statusMessage }}
        </div>
        <div v-else-if="groupMembersPending || !groupMembers">
            <LoadingIcon />
        </div>
        <ul v-else>
            <li 
                v-for="member in groupMembers"
                class="flex flex-row gap-2 items-center bg-main-800 p-2 rounded-md ring-md"
                :key="member.user.id">
                <!-- todo: https://reka-ui.com/docs/components/avatar#avatar -->
                <img 
                    v-if="member.user.image"
                    class="size-8 rounded-full"
                    :src="member.user.image" 
                    :alt="`Profile picture for ${member.user.name}`">
                <div v-else class="size-8 rounded-full flex items-center justify-center bg-main-700">
                    ?
                </div>
                <span class="text-txt-primary">
                    {{ member.user.name }}
                </span>
                <span>/</span>
                <span class="capitalize">
                    {{ member.role }}
                </span>
            </li>
        </ul>
    </div>
</template>