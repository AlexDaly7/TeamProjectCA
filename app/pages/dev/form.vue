<script setup lang="ts">
import z from 'zod';
import type { ActionButtonResult } from '~/utils/types/actionButton';
import { zodDateRange } from '~~/shared/validation';

const { $authClient } = useNuxtApp();

async function onSubmit(values: z.infer<typeof validationSchema>): Promise<ActionButtonResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    alert(JSON.stringify(values));
    return { error: true, message: 'Test' };
}

const validationSchema = z.object({
    name: z.string('Name is required.').min(3, 'Too short!'),

    tag: z
        .string('Tag is required')
        .min(3, 'Too short!')
        .refine((tag) => tag.indexOf(' ') < 0, {
            error: 'Tag cannot have whitespace!',
            abort: true,
        })
        .refine(validateTag, 'Tag already taken!'),

    description: z.string('Description').optional(),

    email: z.email('Invalid email.'),

    dateRange: zodDateRange,

    favAnimal: z.string(),
});

async function validateTag(tag: string): Promise<boolean> {
    const { data, error } = await tryCatch(
        $authClient.organization.checkSlug({
            slug: `org-${tag}`,
        }),
    );

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
            :validationSchema
            :submitBtn="{
                icon: 'hugeicons:add-01',
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
                    required: false,
                },
                {
                    fieldType: 'text-email',
                    name: 'email',
                    label: 'Email',
                    placeholder: 'you@example.com',
                    required: true,
                },
                {
                    fieldType: 'date-range',
                    name: 'dateRange',
                    label: 'Selection Range',
                    required: true,
                },
                {
                    fieldType: 'select',
                    name: 'favAnimal',
                    label: 'Favorite Animal',
                    placeholder: 'Select an animal',
                    required: true,
                    selectItems: {
                        list: [
                            { label: 'Dogs', value: 'dogs', iconUrl: 'https://picsum.photos/256' },
                            { label: 'Cats', value: 'cats', iconUrl: 'https://picsum.photos/256' },
                            { label: 'Rabbits', value: 'rabbits', iconUrl: 'https://picsum.photos/256' },
                        ],
                    },
                },
            ]" />
    </div>
</template>
