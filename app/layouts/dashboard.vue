<script setup lang="ts">
// const { $authSession } = useNuxtApp();

// const selectedGroup = computed(() => $authSession.data.value?.user.selectedGroup);
// const selectedProject = computed(() => $authSession.data.value?.user.selectedProject);

const route = useRoute();

const groupId = computed(() => route.params.groupId);
const projectId = computed(() => route.params.projectId);

</script>

<template>
    <div class="w-full min-h-screen flex flex-col">
        <nav 
            class="flex flex-row gap-2 p-2
            bg-main-800 ring-1 ring-inset ring-main-50/10">
            <NuxtLink v-if="groupId" :to="{ name: 'dashboard' }">
                <ButtonSecondary class="inline-flex items-center gap-2">
                    <Icon name="hugeicons:arrow-left-01" />
                    All groups
                </ButtonSecondary>
            </NuxtLink>
            <ButtonSecondary
                v-else
                class="inline-flex items-center gap-2"
                disabled>
                <Icon name="hugeicons:arrow-left-01" />
                All groups
            </ButtonSecondary>

            <NuxtLink v-if="projectId" :to="{ name: 'dashboard-group-groupId', params: { groupId } }">
                <ButtonSecondary class="inline-flex items-center gap-2">
                    <Icon name="hugeicons:arrow-left-01" />
                    Projects
                </ButtonSecondary>
            </NuxtLink>
        </nav>
        <div class="h-full w-full flex flex-col p-2 grow">
            <slot />
        </div>
    </div>
</template>