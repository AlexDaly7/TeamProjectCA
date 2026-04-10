import z from "zod";

export const zodDateRange = z.object({
    start: z.date({ error: 'A start date is required.' }),
    end: z.date({ error: 'An end date is required.' })
});