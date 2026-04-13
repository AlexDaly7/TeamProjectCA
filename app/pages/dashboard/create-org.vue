<script setup lang="ts">
import z from 'zod';
import type { ActionButtonResult } from '~/utils/types/actionButton';
import slugify from 'slugify';
import { VSCreateOrg } from '~/utils/schemas/createOrg';

useAppHead({
    pageTitle: 'Create an Organization',
});

const { $authClient } = useNuxtApp();
const router = useRouter();
const { refreshOrganizations } = useOrganizations();

const validationSchema = VSCreateOrg;

async function onSubmitNew({ name, slug }: z.infer<typeof validationSchema>): Promise<ActionButtonResult> {
    const { data: created, error } = await tryCatch($authClient.organization.create({ name, slug }));

    if (error) {
        return { error: true, message: 'Unknown error. Please try again.' };
    } else if (created.error) {
        return { error: true, message: created.error.message ?? 'Unknown error creating org.' };
    }

    await refreshOrganizations();
    router.push({ name: 'dashboard-orgSlug', params: { orgSlug: created.data.slug } });

    return { error: false };
}
</script>

<template>
    <div class="flex flex-col w-full max-w-prose mx-auto mt-6">
        <HeadersPage
            title="Create a new organization"
            description="Create a new organization to collaborate with a team." />

        <FormBuilderNew
            @submit="onSubmitNew"
            :validationSchema
            :submitBtn="{
                icon: 'hugeicons:add-01',
                label: 'Create',
            }"
            :fields="[
                {
                    fieldType: 'text',
                    label: 'Name',
                    name: 'name',
                    placeholder: 'My Awesome Org',
                    required: true,
                },
                {
                    fieldType: 'text',
                    label: 'Slug',
                    name: 'slug',
                    placeholder: 'my-awesome-org',
                    required: true,
                    watcher: ({ name }) => slugify(name),
                    watcherDebounceMs: 300,
                },
            ]" />
    </div>
</template>
