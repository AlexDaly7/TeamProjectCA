<script setup lang="ts">
import { ClientInsertOrganization } from "~~/shared/validation";

const { $authClient } = useNuxtApp();
const router = useRouter();
const { refreshOrganizations } = useOrganizations();

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(ClientInsertOrganization),
});

const { isOpen, isLoading, submitHandler, submitError } = useEditDialogForm({ meta, handleSubmit, setErrors });


async function checkSlug(slug: string): Promise<{ validated: boolean, message: string }> {
    const { data, error } = await $authClient.organization.checkSlug({ slug: `org-${slug}` });

    if (error) {
        return { validated: false, message: error.message ?? 'Unknown error checking slug.' };
    }

    if (data.status === true) return { validated: true, message: '' };

    return { validated: false, message: 'Invalid slug!' };
}

const onSubmit = submitHandler(
    async ({ name, slug }) => {
        if (!name || !slug) return { error: true, message: 'Invalid name or slug.' };

        const check = await checkSlug(slug);
        if (!check.validated) {
            return { error: true, message: check.message };
        }

        const { data: created, error } = await tryCatch($authClient.organization.create({ name, slug }));
        if (error) {
            return { error: true, message: 'Unknown error. Please try again.' }
        } else if (created.error) {
            return { error: true, message: created.error.message ?? 'Unknown error creating org.' }
        } else {
            await refreshOrganizations();
            return { error: false, data: created.data };
        }
    }, 
    async ({ slug }) => {
        router.push({ name: 'dashboard-orgSlug', params: { orgSlug: slug } });
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
            <FormBuilder
                :onSubmit
                :isLoading
                :isValid="meta.valid"
                :errors
                :submitError
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
                        placeholder: 'My Awesome Org',
                    },
                    {
                        name: 'slug',
                        label: 'Slug',
                        as: 'input',
                        type: 'text',
                        placeholder: 'my-awesome-org'
                    },
                ]" />
        </template>
    </AppDialog>
</template>