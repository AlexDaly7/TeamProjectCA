import z from "zod";

export const ClientInsertTask = z.object({
    title: z.string('A title is required.')
        .min(3, 'Too short!')
        .max(100, 'Too long!'),
    description: z.string()
        .max(2000, 'Too long!')
        .optional(),
    parentId: z.number().nullable().optional(),
    dateRange: z.object({ // vee-validate DateRange object
        start: preprocessDate,
        end: preprocessDate,
    }),
    order: z.number().nullable().optional(),
});

export type ClientInsertTaskSchema = z.infer<typeof ClientInsertTask>;


export const ClientModifyTask = ClientInsertTask.extend({
    dateRange: z.object({
        start: preprocessDate,
        end: preprocessDate,
    }).optional(),
    progress: z.number().nullable().optional(),
});

export type ClientModifyTaskSchema = z.infer<typeof ClientModifyTask>;