import z from "zod";

export const ClientInsertTask = z.object({
    title: z.string(),
    description: z.string().optional(),
    parentId: z.number().nullable().optional(),
    dateRange: z.object({ // vee-validate DateRange object
        start: z.date(),
        end: z.date(),
    }),
    progress: z.number().nullable().optional(),
    order: z.number().nullable().optional(),
});

export type ClientInsertTaskSchema = z.infer<typeof ClientInsertTask>;


export const ClientModifyTask = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    parentId: z.number().nullable().optional(),
    dateRange: z.object({ // vee-validate DateRange object
        start: z.date().optional(),
        end: z.date().optional(),
    }).optional(),
    progress: z.number().nullable().optional(),
    order: z.number().nullable().optional(),
});

export type ClientModifyTaskSchema = z.infer<typeof ClientModifyTask>;