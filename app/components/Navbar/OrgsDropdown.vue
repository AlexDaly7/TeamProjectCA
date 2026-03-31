<script setup lang="ts">
const { $authClient } = useNuxtApp();
const {
    organizations,
    organizationsPending: loading,
} = useOrganizations();

const popoverOpen = ref(false);

const activeOrg = $authClient.useActiveOrganization();

const currentOrg = computed(() => activeOrg.value.data?.name ?? organizations.value?.active?.name ?? 'Select an org');

function onSelectOrg(slug: string) {
    $authClient.organization.setActive({ organizationSlug: slug });
    popoverOpen.value = false;
}

</script>

<template>
    <AppPopover v-model:is-open="popoverOpen">
        <template #trigger> 
            <div class="w-full p-2 rounded-lg inline-flex gap-2 items-center cursor-pointer select-none
                hover:bg-main-700 transition-all duration-75"
                :class="{ 'bg-main-700! ring-md': popoverOpen }">
                <div v-if="loading || !organizations">
                    Loading...
                </div>
                <div v-else class="w-full font-semibold inline-flex justify-between items-center">
                    <div class="inline-flex gap-2">
                        <img
                            class="size-6 rounded-full"
                            :src="`https://avatar.vercel.sh/${currentOrg}.svg`"
                            referrerpolicy="no-referrer"
                            :alt="`Icon for ${currentOrg}`">
                        <span class="text-ellipsis overflow-hidden line-clamp-1">
                            {{ currentOrg }}
                        </span>
                    </div>
                    <Icon name="hugeicons:arrow-up-down" />
                </div>
            </div>
        </template>

        <template #content>
            <div class="min-w-68">
                <div class="flex flex-col gap-2 p-2">
                    <template v-if="loading || !organizations">
                        Loading...
                    </template>
                    <template v-else>
                        <ButtonTertiary 
                            v-for="organization in organizations.all"
                            bg-level="700"
                            class="inline-flex justify-between items-center px-2! text-sm"
                            exact-active-class=""
                            :key="organization.id"
                            :to="{ name: 'dashboard-orgSlug', params: { orgSlug: organization.slug } }"
                            @click="onSelectOrg(organization.slug)">
                            <div class="inline-flex gap-2">
                                <img
                                    class="size-6 rounded-full"
                                    :src="`https://avatar.vercel.sh/${organization.name}.svg`"
                                    referrerpolicy="no-referrer"
                                    :alt="`Icon for ${organization.name}`">
                                <span>{{ organization.name }}</span>
                            </div>
                            <Icon 
                                v-if="organization.name === currentOrg"
                                name="hugeicons:tick-02" 
                                class="text-txt-secondary" />
                        </ButtonTertiary>
                    </template>
                </div>

                <div class="w-full h-px bg-main-50/10 mb-2"></div>

                <div class="p-2">
                    <ButtonCreateOrg @on-submit="popoverOpen = false" >
                        <ButtonTertiary
                            bg-level="700"
                            class="w-full inline-flex items-center px-2! gap-2">
                            <Icon 
                                name="hugeicons:add-01"
                                size="20"
                                class="text-txt-secondary" />
                            <div class="flex flex-col items-start">
                                <span>
                                    Create new organization
                                </span>
                                <span class="text-xs text-txt-secondary">
                                    Collaborate with a team
                                </span>
                            </div>
                        </ButtonTertiary>
                    </ButtonCreateOrg>
                </div>
            </div>
        </template>
    </AppPopover>
</template>