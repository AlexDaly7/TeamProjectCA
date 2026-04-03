import z from "zod";

export const ClientInsertOrganization = z.object({
    name: z.string(),
    slug: z.string(),
    logo: z.string().optional().nullable(),
});

export type ClientInsertOrganizationSchema = z.infer<typeof ClientInsertOrganization>;