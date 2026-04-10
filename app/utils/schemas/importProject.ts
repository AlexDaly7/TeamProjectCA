import z from "zod";


export const VSImportProject = z.object({
    title: z.string('Title is required.')
        .min(3, 'Too short!')
        .max(32, 'Too long!'),
    repo: z
        .string('Repo is required'),
});