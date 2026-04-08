import z from "zod";

export const ClientInsertOrganization = z.object({
    name: z.string('A name is required.').min(3, 'Too short!').max(32, 'Too long!'),
    slug: z.string('A slug is required.').min(3, 'Too short').max(32, 'Too long!'),
    logo: z.string().optional().nullable(),
});

export type ClientInsertOrganizationSchema = z.infer<typeof ClientInsertOrganization>;