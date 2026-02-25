import { H3Event } from "#imports";

export default function validateRouterParam(event: H3Event, paramName: string) {
    const param = getRouterParam(event, paramName);
    if (!param) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: `'${paramName}' is required.`,
        });
    } 

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