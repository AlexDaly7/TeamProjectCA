<script setup lang="ts">
// const { $authSession } = useNuxtApp();

// const selectedGroup = computed(() => $authSession.data.value?.user.selectedGroup);
// const selectedProject = computed(() => $authSession.data.value?.user.selectedProject);

const organizationsStore = useOrganizationsStore();
const { organizations, loading, error } = storeToRefs(organizationsStore);

const route = useRoute();

const orgSlug = computed(() => route.params.orgSlug);
const projectId = computed(() => route.params.projectId);

const sidebarType = computed(() => route.meta.sidebarType);

const popoverOpen = ref(false);

</script>

<template>
    <AppPopover 
        :is-open="popoverOpen">
        <template #trigger> 
            <div class="w-full p-2 rounded-lg inline-flex gap-2 items-center cursor-pointer select-none
                hover:bg-main-700 transition-all duration-75"
                :class="{ 'bg-main-700! ring-md': popoverOpen }">
                <template v-if="loading || !organizations">
                    Loading...
                </template>
                <template v-else>
                    <div class="w-full font-bold inline-flex justify-between items-center">
                        <span>{{ organizations.active.name }}</span>
                        <Icon name="hugeicons:arrow-up-down" />
                    </div>
                </template>
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
                            exact-active-class="group active"
                            :key="organization.id"
                            :to="{ name: 'dashboard-orgSlug', params: { orgSlug: organization.slug } }">
                            <span>{{ organization.name }}</span>
                            <Icon 
                                name="hugeicons:tick-02" 
                                class="text-txt-secondary hidden group-[.active]:block" />
                        </ButtonTertiary>
                    </template>
                </div>

                <div class="w-full h-px bg-main-50/10 mb-2"></div>

                <div class="p-2">
                    <ButtonTertiary
                        bg-level="700"
                        class="w-full inline-flex items-center px-2! gap-2"
                        :to="{ name: 'dashboard-account-profile' }"
                        @click="popoverOpen = false">
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
                </div>
            </div>
        </template>
    </AppPopover>
</template>