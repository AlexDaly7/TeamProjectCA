<script setup lang="ts">
const { $authClient } = useNuxtApp();

const { data: orgMembers, error: orgMembersError } = await $authClient.organization.listMembers();

const inviteeEmail = ref<string>("");
const inviteeRole = ref<'admin' | 'owner' | 'member' | null>(null);

// TODO: show invites

async function addUserToGroup() {
    // TODO: show errors
    if (!inviteeEmail.value || !inviteeRole.value) return;

    const { data, error } = await $authClient.organization.inviteMember({
        email: inviteeEmail.value,
        role: inviteeRole.value,
    });

    if (error) {
        alert(`Error adding member to organization: ${error}`);
    } else {
        console.log('Added new org member ', data);
    }
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
                v-model="inviteeEmail"/>
            <select
                v-model="inviteeRole">
                <option :value="null" selected disabled>Select a role...</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <!-- <option value="owner">Owner</option> -->
            </select>
            <ButtonSecondary type="submit">Add members to group.</ButtonSecondary>
        </form>
        <div v-if="orgMembersError || !orgMembers">
            Error loading organization members: {{ orgMembersError?.message ?? 'Unknown error' }}
        </div>
        <ul v-else>
            <li 
                v-for="member in orgMembers.members"
                class="flex flex-row gap-2 items-center bg-main-800 p-2 rounded-md ring-md"
                :key="member.id">
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