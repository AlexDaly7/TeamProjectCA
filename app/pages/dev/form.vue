<script setup lang="ts">
import z from 'zod';
import type { ActionButtonResult } from '~/utils/types/actionButton';

const { $authClient } = useNuxtApp();

function onSubmit(): ActionButtonResult {
    // alert('submitted!');
    return { error: true, message: 'Test' };
}

const isLoading = ref(false);



const validationSchema = z.object({
    name: z.string('Name is required.')
        .min(3, 'Too short!'),

    tag: z.string('Tag is required')
        .min(3, 'Too short!')
        .refine((tag) => tag.indexOf(' ') < 0, {
            error: 'Tag cannot have whitespace!',
            abort: true,
        })
        .refine(validateTag, 'Tag already taken!'),

    description: z.string('Description').optional(),

    email: z.email('Invalid email.')
});

async function validateTag(tag: string): Promise<boolean> {
    const { data, error } = await tryCatch($authClient.organization.checkSlug({
        slug: `org-${tag}`,
    }));

    if (error || data.error || !data.data.status) {
        return false;
    }

    return true;
}
</script>

<template>
    <div class="w-full max-w-prose mx-auto">
        <FormBuilderNew
            @submit="onSubmit"
            :isLoading
            :validationSchema
            :submitBtn="{
                icon: 'lucide:add-01',
                label: 'Submit',
            }"
            :fields="[
                {
                    fieldType: 'text',
                    name: 'name',
                    label: 'Name',
                    placeholder: 'John  Doe',
                    required: true,
                },
                {
                    fieldType: 'text',
                    name: 'tag',
                    label: 'Tag',
                    placeholder: 'john-doe',
                    required: true,
                    watcher: (values) => values.name.trim().toLowerCase().replaceAll(' ', '-'),
                    watcherDebounceMs: 150,
                },
                {
                    fieldType: 'text-multiline',
                    name: 'description',
                    label: 'Description',
                    placeholder: 'This should be multiline...',
                    required: true,
                },
                {
                    fieldType: 'text-email',
                    name: 'email',
                    label: 'Email',
                    placeholder: 'you@example.com',
                    required: true,
                }
            ]" />
    </div>
</template>