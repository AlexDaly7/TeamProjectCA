<script setup lang="ts">
const {
    organizations,
    organizationsPending: loading,
} = useOrganizations();

const currentOrgSimple = computed(
    () => organizations.value?.all.find(org => org.slug === currentOrgSlug.value) ?? null);

const { 
    org: currentOrg,
    orgSlug: currentOrgSlug,
} = useCurrentOrg();
</script>

<template>
    <AppPopover>
        <template #trigger> 
            <div class="w-full p-2 rounded-lg inline-flex gap-2 items-center cursor-pointer select-none
                ring-inset ring-0
                hover:bg-main-700 transition-all duration-75
                data-[state=open]:bg-main-700 data-[state=open]:ring-main-50/10 data-[state=open]:ring-1">
                <div v-if="!currentOrgSimple" class="text-txt-secondary">
                    Loading...
                </div>
                <div v-else class="w-full font-semibold inline-flex justify-between items-center">
                    <div class="inline-flex gap-2">
                        <img
                            class="size-6 rounded-full"
                            :src="`https://avatar.vercel.sh/${currentOrgSimple.slug}.svg`"
                            referrerpolicy="no-referrer"
                            :alt="`Icon for ${currentOrgSimple.name}`">
                        <span class="text-ellipsis overflow-hidden line-clamp-1">
                            {{ currentOrgSimple.name }}
                        </span>
                    </div>
                    <Icon name="hugeicons:arrow-up-down" />
                </div>
            </div>
        </template>

        <template #content="{ close }">
            <div class="min-w-68">
                <div class="flex flex-col gap-2 p-2">
                    <template v-if="loading || !organizations">
                        Loading...
                    </template>
                    <template v-else>
                        <ButtonTertiary 
                            v-for="organization in organizations.all"
                            bg-level="700"
                            class="inline-flex justify-between items-center px-2! text-sm rounded-lg!"
                            exact-active-class=""
                            :key="organization.id"
                            :to="{ name: 'dashboard-orgSlug', params: { orgSlug: organization.slug } }"
                            @click="close">
                            <div class="inline-flex gap-2">
                                <img
                                    class="size-6 rounded-full"
                                    :src="`https://avatar.vercel.sh/${organization.slug}.svg`"
                                    referrerpolicy="no-referrer"
                                    :alt="`Icon for ${organization.name}`">
                                <span>{{ organization.name }}</span>
                            </div>
                            <Icon 
                                v-if="organization.slug === currentOrg?.slug"
                                name="hugeicons:tick-02" 
                                class="text-txt-secondary" />
                        </ButtonTertiary>
                    </template>
                </div>

                <div class="w-full h-px bg-main-50/10 mb-2"></div>

                <div class="p-2">
                    <ButtonCreateOrg @on-submit="close" >
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