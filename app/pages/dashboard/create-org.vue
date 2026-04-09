<script setup lang="ts">
import { ClientInsertOrganization } from "~~/shared/validation";

useAppHead({
    pageTitle: 'Create an Organization',
});

const { $authClient } = useNuxtApp();
const router = useRouter();
const { refreshOrganizations } = useOrganizations();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(ClientInsertOrganization),
});

const { isLoading, submitHandler, submitError } = useEditDialogForm({ meta, handleSubmit, setErrors }, { confirmBeforeExiting: false });

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
    }
);

</script>

<template>
    <div class="flex flex-col w-full max-w-prose mx-auto mt-6">
        <PageHeader
            title="Create a new organization"
            description="Create a new organization to collaborate with a team." />

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
    </div>
</template>