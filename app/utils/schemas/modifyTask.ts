import z from "zod";
import { zodDateRange } from "~~/shared/validation";

// See InsertTask;
export const VSModifyTask = z.object({
    title: z.string('A title is required.')
        .min(3, 'Too short!')
        .max(100, 'Too long!'),
    description: z.string()
        .max(2000, 'Too long!')
        .optional(),
    dateRange: zodDateRange,
    progress: z.number()
});