<script setup lang="ts">
const { organizations, organizationsPending: loading } = useOrganizations();

const currentOrgSimple = computed(
    () => organizations.value?.all.find((org) => org.slug === currentOrgSlug.value) ?? null,
);

const { org: currentOrg, orgSlug: currentOrgSlug } = useCurrentOrg();
</script>

<template>
    <AppPopover>
        <template #trigger>
            <AppButton variant="tertiary-sidebar" size="md-even" class="w-full">
                <div v-if="!currentOrgSimple">Loading...</div>
                <div v-else class="w-full flex flex-row gap-2 items-center font-semibold">
                    <img
                        class="size-6 rounded-full"
                        :src="`https://avatar.vercel.sh/${currentOrgSimple.slug}.svg`"
                        referrerpolicy="no-referrer"
                        :alt="`Icon for ${currentOrgSimple.name}`" />
                    <span class="text-ellipsis overflow-hidden line-clamp-1 text-txt-primary">
                        {{ currentOrgSimple.name }}
                    </span>
                    <Icon name="hugeicons:arrow-up-down" class="ml-auto" size="16" />
                </div>
            </AppButton>
        </template>

        <template #content="{ close }">
            <div class="min-w-68">
                <div class="flex flex-col gap-2 p-2">
                    <template v-if="loading || !organizations"> Loading... </template>
                    <template v-else>
                        <AppButton
                            v-for="organization in organizations.all"
                            variant="tertiary"
                            size="md-even"
                            class="rounded-lg!"
                            exact-active-class="text-txt-primary!"
                            :key="organization.id"
                            :to="{ name: 'dashboard-orgSlug', params: { orgSlug: organization.slug } }"
                            @click="close">
                            <div class="flex flex-row gap-2 items-center text-sm font-medium">
                                <img
                                    class="size-6 rounded-full"
                                    :src="`https://avatar.vercel.sh/${organization.slug}.svg`"
                                    referrerpolicy="no-referrer"
                                    :alt="`Icon for ${organization.name}`" />
                                <span>{{ organization.name }}</span>
                                <Icon
                                    v-if="organization.slug === currentOrg?.slug"
                                    name="hugeicons:tick-02"
                                    class="ml-auto" />
                            </div>
                        </AppButton>
                    </template>
                </div>

                <div class="w-full h-px bg-main-50/10"></div>

                <div class="p-2">
                    <AppButton
                        variant="tertiary"
                        size="md-even"
                        class="w-full inline-flex items-center gap-2 rounded-lg!"
                        :to="{ name: 'dashboard-create-org' }">
                        <Icon name="hugeicons:add-01" size="20" />
                        <div class="flex flex-col items-start">
                            <span class="text-txt-primary"> Create new organization </span>
                            <span class="text-xs"> Collaborate with a team </span>
                        </div>
                    </AppButton>
                </div>
            </div>
        </template>
    </AppPopover>
</template>
