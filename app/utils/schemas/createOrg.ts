import z from 'zod';
import slugify from 'slugify';

async function validateSlug(tag: string): Promise<boolean> {
    const { $authClient } = useNuxtApp();

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

export const VSCreateOrg = z.object({
    name: z.string('A name is required.').min(3, 'Too short!').max(32, 'Too long!'),

    slug: z
        .string('A slug is required.')
        .min(3, { error: 'Too short!', abort: true })
        .max(32, { error: 'Too long!', abort: true })
        .refine((val) => val === slugify(val), { error: 'Invalid slug!', abort: true })
        .refine(validateSlug, 'Slug already taken!'),
});
