import z from 'zod';

export const ClientInsertProject = z.object({
    title: z.string('Title is required.').min(3, 'Too short!').max(32, 'Too long!'),
    repo: z.string('Repo is required'),

    organizationId: z.string(),
});

export type ClientInsertProjectSchema = z.infer<typeof ClientInsertProject>;
