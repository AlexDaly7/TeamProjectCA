import { type H3Event, getRouterParam, createError, readValidatedBody } from 'h3';
import z from 'zod';

export async function validateBody<T>(event: H3Event, schema: z.ZodType<T>): Promise<T> {
    const result = await readValidatedBody(event, schema.safeParse);

    if (!result.success) {
        const statusMessage = result.error.issues.map((issue) => `${issue.path.join('')}: ${issue.message}`).join('; ');

        const statusData = result.error.issues.reduce(
            (errors, issue) => {
                errors[issue.path.join('')] = issue.message;
                return errors;
            },
            {} as Record<string, string>,
        );

        throw createError({
            statusCode: 422,
            statusMessage,
            data: statusData,
        });
    }

    return result.data;
}

export function validateRouterParam(event: H3Event, paramName: string, ensureInt?: true): number;
export function validateRouterParam(event: H3Event, paramName: string, ensureInt: false): string;
export function validateRouterParam(
    event: H3Event,
    paramName: string,
    ensureInt: boolean = true,
): string | number {
    const param = getRouterParam(event, paramName);
    if (param === undefined || param === null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: `'${paramName}' is required.`,
        });
    }

    if (ensureInt) {
        const parsedParam = Number(param);
        if (isNaN(parsedParam) || !Number.isInteger(parsedParam)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: `'${paramName}' needs to be an integer.`,
            });
        }

        return parsedParam;
    }

    return param;
}
