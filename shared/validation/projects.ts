import z from "zod";

export const ClientInsertProject = z.object({
    title: z.string(),

    organizationId: z.string(),

    repo: z.string(),
});

export type ClientInsertProjectSchema = z.infer<typeof ClientInsertProject>;