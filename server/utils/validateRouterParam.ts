import { H3Event } from "#imports";

export default function validateRouterParam(event: H3Event, paramName: string, ensureInt?: true): number;
export default function validateRouterParam(event: H3Event, paramName: string, ensureInt: false): string;
export default function validateRouterParam(event: H3Event, paramName: string, ensureInt: boolean = true): string | number {
    const param = getRouterParam(event, paramName);
    if (!param) {
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