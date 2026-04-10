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
    progress: z.number()
        .min(0, 'Cannot be under 0%')
        .max(1, 'Cannot be over 100%')
        .nullable().optional(),
});

export type ClientInsertTaskSchema = z.infer<typeof ClientInsertTask>;


export const ClientModifyTask = ClientInsertTask.extend({
    dateRange: z.object({
        start: preprocessDate,
        end: preprocessDate,
    }).optional(),
});

export type ClientModifyTaskSchema = z.infer<typeof ClientModifyTask>;