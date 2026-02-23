import type { H3Event } from 'h3';
import z from "zod";

export async function validateBody<T>(event: H3Event, schema: z.ZodType<T>): Promise<T> {
    const result = await readValidatedBody(event, schema.safeParse);

    if (!result.success) {
        const statusMessage = result.error.issues
            .map((issue) => `${issue.path.join('')}: ${issue.message}`)
            .join("; ");

        const statusData = result.error.issues.reduce((errors, issue) => {
            errors[issue.path.join('')] = issue.message;
            return errors;
        }, {} as Record<string, string>);

        throw createError({
            status: 422,
            statusMessage,
            data: statusData,
        });
    }

    return result.data;
}

export function parseIdParam(event: H3Event): number {
    const idString = getRouterParam(event, "id");
    const id = parseInt(idString ?? '');

    if (isNaN(id) || id <= 0) {
        throw createError({
            status: 400,
            statusMessage: 'Invalid ID.'
        })
    }

    return id;
}