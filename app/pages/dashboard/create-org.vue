<script setup lang="ts">
import z from "zod";
import type { ActionButtonResult } from "~/utils/types/actionButton";
import slugify from 'slugify';

useAppHead({
    pageTitle: 'Create an Organization',
});

const { $authClient } = useNuxtApp();
const router = useRouter();
const { refreshOrganizations } = useOrganizations();

async function validateSlug(tag: string): Promise<boolean> {
    const { data, error } = await tryCatch($authClient.organization.checkSlug({
        slug: `org-${tag}`,
    }));

    if (error || data.error || !data.data.status) {
        return false;
    }

    return true;
}

async function onSubmitNew({ name, slug }: z.infer<typeof validationSchema>): Promise<ActionButtonResult> {
    const availableSlug = await validateSlug(slug);
    if (!availableSlug) {
        return { error: true, message: 'Slug already taken!' };
    }

    const { data: created, error } = await tryCatch($authClient.organization.create({ name, slug }));
    
    if (error) {
        return { error: true, message: 'Unknown error. Please try again.' }
    } else if (created.error) {
        return { error: true, message: created.error.message ?? 'Unknown error creating org.' }
    }

    await refreshOrganizations();
    router.push({ name: 'dashboard-orgSlug', params: { orgSlug: created.data.slug } });

    return { error: false };
}

const validationSchema = z.object({
    name: z.string('A name is required.')
        .min(3, 'Too short!')
        .max(32, 'Too long!'),

    slug: z.string('A slug is required.')
        .min(3, { error: 'Too short!', abort: true })
        .max(32, { error: 'Too long!', abort: true })
        .refine((val) => val === slugify(val), { error: 'Invalid slug!', abort: true })
        .refine(validateSlug, 'Slug already taken!'),
});
</script>

<template>
    <div class="flex flex-col w-full max-w-prose mx-auto mt-6">
        <PageHeader
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
                }
            ]" />
    </div>
</template>