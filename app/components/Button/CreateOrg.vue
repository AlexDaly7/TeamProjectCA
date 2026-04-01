<script setup lang="ts">
import { InsertOrganization } from '~~/lib/db/schema';

const { $authClient } = useNuxtApp();
const router = useRouter();
const organizationsStore = useOrganizationsStore();

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertOrganization),
});

const { isOpen, isLoading, submitHandler, submitError } = useEditDialogForm({ meta, handleSubmit, setErrors });


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
        emit('onSubmit');
    }
);

const emit = defineEmits<{
    onSubmit: [],
}>();

watch(isOpen, (newValue) => {
    if (newValue) {
        resetForm();
    }
});
</script>

<template>
    <AppDialog
        title="Create a new organization"
        description="Create a new organization to collaborate with a team."
        v-model:is-open="isOpen">
        <template #trigger>
            <slot></slot>
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
</template>