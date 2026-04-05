<script setup lang="ts">
definePageMeta({
    sidebarType: 'org',
});

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
                label="Enter the email of the person you would like to add."
                placeholder="e.g user@email.com"
                name="userInput"
                v-model="inviteeEmail"/>
            <select
                v-model="inviteeRole">
                <option :value="null" selected disabled>Select a role...</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <!-- <option value="owner">Owner</option> -->
            </select>
            <AppButton 
                variant="secondary" 
                type="submit">
                Add member to organizaation
            </AppButton>
        </form>
        <div v-if="orgMembersError || !orgMembers">
            Error loading organization members: {{ orgMembersError?.message ?? 'Unknown error' }}
        </div>
        <ul v-else>
            <li 
                v-for="member in orgMembers.members"
                class="flex flex-row gap-2 items-center bg-main-800 p-2 rounded-md ring-md"
                :key="member.id">
                <AppAvatar
                    :image="member.user.image"
                    :name="member.user.name" />
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