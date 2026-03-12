<script setup lang="ts">
import type { Organization } from 'better-auth/plugins';
import { InsertOrganization } from '~~/lib/db/schema';

const router = useRouter();
const { $authClient } = useNuxtApp();
const organizationsStore = useOrganizationsStore();
const { organizations, loading, error } = storeToRefs(organizationsStore);

const popoverOpen = ref(false);

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertOrganization),
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit, setErrors });


async function checkSlug(slug: string): Promise<{ validated: boolean, message: string }> {
    // TODO: fix this
    const { data, error } = await $authClient.organization.checkSlug({ slug });

    if (error) {
        return { validated: false, message: 'Error occurred validating slug. Please try again later.' };
    }

    if (data.status === true) return { validated: true, message: '' };

    return { validated: false, message: 'Group with that slug already exists!' };
}

const onSubmit = submitHandler(
    async ({ name, slug }) => {
        if (!name || !slug) return { error: true, message: 'Invalid name or slug.' };

        const check = await checkSlug(slug);
        if (check.validated === false) {
            return { error: true, message: check.message };
        }

        try {
            const created = await $authClient.organization.create({ name, slug });

            if (created.error) {
                return { error: true, message: created.error.message ?? 'Unknown error creating org.' }
            } else {
                return { error: false, data: created.data };
            }
        } catch (e) {   
            return { error: true, message: 'Unknown error. Please try again.' };
        }
    }, 
    async ({ slug }) => {
        router.push({ name: 'dashboard-orgSlug', params: { orgSlug: slug } });
        organizationsStore.fetchOrganizations();
        popoverOpen.value = false;
    }
);

watch(isOpen, (newValue) => {
    if (newValue) {
        resetForm();
    }
});

const activeOrg = $authClient.useActiveOrganization();

const currentOrg = computed(() => activeOrg.value.data?.name ?? organizations.value?.active?.name ?? 'Select an org');

function onSelectOrg(org: Organization) {
    $authClient.organization.setActive({ organizationSlug: org.slug });
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
                <div v-else class="w-full font-bold inline-flex justify-between items-center">
                    <span class="text-ellipsis overflow-hidden line-clamp-1">
                        {{ currentOrg }}
                    </span>
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
                            @click="onSelectOrg(organization)">
                            <span>{{ organization.name }}</span>
                            <Icon 
                                v-if="organization.name === currentOrg"
                                name="hugeicons:tick-02" 
                                class="text-txt-secondary" />
                        </ButtonTertiary>
                    </template>
                </div>

                <div class="w-full h-px bg-main-50/10 mb-2"></div>

                <div class="p-2">
                    <AppDialog
                        title="Create a new organization"
                        description="Create a new organization to collaborate with a team."
                        v-model:is-open="isOpen">
                        <template #trigger>
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
                        </template>

                        <template #body>
                            <span
                                v-if="submitError"
                                class="text-danger-txt font-bold mb-2">
                                {{ submitError }}
                            </span>
                            <AppDynamicForm
                                :onSubmit
                                :isLoading
                                :errors
                                :submitBtn="{
                                    icon: 'hugeicons:add-01',
                                    label: 'Create',
                                }"
                                :fields="[
                                    {
                                        name: 'name',
                                        label: 'Name',
                                        as: 'input',
                                        type: 'text',
                                        placeholder: 'e.g. My Org',
                                    },
                                    {
                                        name: 'slug',
                                        label: 'Slug',
                                        as: 'input',
                                        type: 'text',
                                        placeholder: 'e.g. my-org'
                                    },
                                ]" />
                        </template>
                    </AppDialog>
                </div>
            </div>
        </template>
    </AppPopover>
</template>