<script setup lang="ts">
import type { ActionButtonResult } from '~/utils/types/actionButton';

definePageMeta({
    sidebarType: 'org',
});

const { org } = useCurrentOrg();

useAppHead({
    pageTitle: 'Members',
    prefix: computed(() => org.value?.name ?? 'Loading...'),
});

const { $authClient } = useNuxtApp();

const {
    data: orgMembers,
    error: orgMembersError,
    pending: orgMembersPending,
    refresh,
} = useFetch(() => `/api/organizations/${org.value?.id}/members`, {
    method: 'GET',
    key: `orgmembers:${org.value?.id}`,
    lazy: true,
});

const inviteeEmail = ref<string>('');
const inviteeRole = ref<'admin' | 'owner' | 'member' | null>(null);
const invitePending = ref(false);
const inviteError = ref<string | null>(null);
const inviteSuccessMessage = ref<string | null>(null);

// TODO: show invites

async function addUserToGroup() {
    // TODO: show errors
    if (!inviteeEmail.value || !inviteeRole.value) return;

    invitePending.value = true;
    inviteError.value = null;
    const { data, error } = await $authClient.organization.inviteMember({
        email: inviteeEmail.value,
        role: inviteeRole.value,
    });

    if (error) {
        inviteError.value = error.message ?? 'Unknown error adding member.';
    } else {
        inviteSuccessMessage.value = `Sent invite to ${data.email}. Invite expires in 48 hours.`;
        refresh();
    }

    invitePending.value = false;
}

const tabs = computed(() => {
    let tabsBuilding = [{ name: 'Members', value: 'members' }];

    if (orgMembers.value?.invitations !== null) {
        tabsBuilding.push({ name: 'Pending Invites', value: 'invites' });
    }

    return tabsBuilding;
});

const pendingInvites = computed(() =>
    (orgMembers.value?.invitations ?? []).filter((i) => i.status === 'pending' || i.status === 'rejected'),
);

async function cancelInvite(invitationId: string): Promise<ActionButtonResult> {
    const { error } = await $authClient.organization.cancelInvitation({
        invitationId,
    });

    if (error) {
        return { error: true, message: error.message ?? 'Unknown error.' };
    } else {
        return { error: false };
    }
}

const onCancelInviteSuccess = () => refresh();

async function removeFromOrg(memberId: string) {
    const { error } = await $authClient.organization.removeMember({
        memberIdOrEmail: memberId,
    });

    if (error) {
        alert(`Error removing member: ${error.message}`);
    }
}
</script>

<template>
    <HeadersPage title="Members" description="Manage team members and invitations." />

    <div class="flex flex-col gap-2">
        <!-- todo: use vee validate -->
        <form class="ring-md bg-main-800 rounded-lg flex flex-col gap-2 p-3" @submit.prevent="addUserToGroup">
            <div
                v-if="inviteError"
                class="w-full bg-danger-bg ring-danger-bg-hover ring-1 ring-inset text-danger-txt p-2 rounded-lg">
                Error: {{ inviteError }}
            </div>

            <div
                v-if="inviteSuccessMessage"
                class="w-full bg-success-bg ring-success-bg-hover ring-1 ring-inset text-success-txt p-2 rounded-lg">
                {{ inviteSuccessMessage }}
            </div>

            <div class="flex flex-row gap-2">
                <div class="flex flex-col gap-2 grow">
                    <AppFormInput
                        label="Email Address"
                        placeholder="user@example.com"
                        name="userInput"
                        type="email"
                        :disabled="invitePending"
                        v-model="inviteeEmail" />
                </div>
                <!-- todo: replace with custom app-wide selector -->
                <div class="flex flex-col gap-2 grow">
                    <Label class="text-sm text-txt-secondary"> Role </Label>
                    <select
                        class="bg-main-700 ring-md h-8 px-2 rounded-md"
                        :class="{ 'opacity-60': invitePending }"
                        v-model="inviteeRole"
                        :disabled="invitePending">
                        <option :value="null" selected disabled>Select a role...</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <AppButton class="w-fit ml-auto" type="submit" :loading="invitePending"> Add member </AppButton>
        </form>
        <div v-if="orgMembersPending" class="w-full min-h-full flex items-center justify-center">
            <LoadingIcon :size="32" />
        </div>
        <div v-else-if="orgMembersError || !orgMembers">
            Error loading organization members: {{ orgMembersError?.message ?? 'Unknown error' }}
        </div>
        <AppTabsContainer v-else :tabs default="members">
            <TabsContent value="members">
                <ul class="flex flex-col gap-2">
                    <li
                        v-for="member in orgMembers.members.members"
                        class="inline-flex gap-3 items-center bg-main-800 p-3 rounded-lg ring-md"
                        :key="member.id">
                        <AppAvatar :image="member.user.image" :name="member.user.name" />
                        <div class="flex flex-col">
                            <span>
                                {{ member.user.name }}
                            </span>
                            <span class="text-txt-secondary text-sm font-medium">
                                {{ member.user.email }}
                            </span>
                        </div>
                        <div class="ml-auto inline-flex items-center gap-2">
                            <span
                                class="text-txt-secondary capitalize text-sm font-medium"
                                :class="{
                                    'font-black! text-success-txt!': member.role === 'owner',
                                }">
                                {{ member.role }}
                            </span>
                            <AppDropdown>
                                <template #trigger>
                                    <div
                                        class="size-8 flex items-center justify-center rounded-md cursor-pointer data-[state=open]:bg-main-700 hover:bg-main-700">
                                        <Icon name="hugeicons:more-horizontal" size="20" />
                                    </div>
                                </template>

                                <template #content>
                                    <AppDropdownItem
                                        text="Change role (TBA)"
                                        icon="hugeicons:edit-04"
                                        @select="() => console.log('To be implemented')" />
                                    <AppDropdownItem
                                        text="Remove from org"
                                        icon="hugeicons:delete-02"
                                        variant="danger"
                                        :disabled="member.role === 'owner'"
                                        @select="removeFromOrg(member.id)" />
                                </template>
                            </AppDropdown>
                        </div>
                    </li>
                </ul>
            </TabsContent>
            <TabsContent v-if="orgMembers.invitations !== null" value="invites">
                <div v-if="pendingInvites.length === 0">No sent invites...</div>
                <ul v-else class="flex flex-col gap-2">
                    <li
                        v-for="invite in pendingInvites"
                        class="inline-flex gap-3 items-center bg-main-800 p-3 rounded-lg ring-md"
                        :key="invite.id">
                        <div class="flex flex-col">
                            <div>
                                <span>{{ invite.email }}</span>
                                <span class="text-txt-secondary"> as </span>
                                <span class="capitalize">{{ invite.role }}</span>
                            </div>
                            <span class="text-txt-secondary text-sm font-medium capitalize">
                                Status: {{ invite.status }}
                            </span>
                        </div>
                        <div class="inline-flex gap-2 items-center ml-auto">
                            <span class="text-txt-secondary capitalize text-sm font-medium">
                                Expires: {{ new Date(invite.expiresAt).toLocaleString() }}
                            </span>
                            <AppActionButton
                                class="flex items-center justify-center"
                                size="md-even"
                                variant="primary"
                                :action="() => cancelInvite(invite.id)"
                                @on-success="onCancelInviteSuccess">
                                <template #trigger>
                                    <Icon name="hugeicons:cancel-01" />
                                </template>
                            </AppActionButton>
                        </div>
                    </li>
                </ul>
            </TabsContent>
        </AppTabsContainer>
    </div>
</template>
