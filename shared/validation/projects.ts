import z from "zod";

export const ClientInsertProject = z.object({
    title: z.string(),

    organizationId: z.string(),

    // repoId: z.int(),
    repoName: z.string(),
    repoOwner: z.string(),
});

export type ClientInsertProjectSchema = z.infer<typeof ClientInsertProject>;