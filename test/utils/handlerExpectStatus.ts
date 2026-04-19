import { expect } from 'vitest';
import { H3Error, type StatusCode, type H3Event } from 'h3';

export function expectResponseStatus<T extends H3Event>(event: T, statusCode: StatusCode) {
    expect(event.node.res.statusCode).toBe(statusCode);
}

export function handlerExpectStatus(fn: () => any, statusCode: number) {
    try {
        fn();
        expect.fail(`Handler expected to throw error with status code ${statusCode}`);
    } catch (error) {
        if (!(error instanceof H3Error)) expect.fail('Error not H3Error');

        expect(error.statusCode).toBe(statusCode);
    }
}

export async function expectHandlerError(
    handler: (event: any) => Promise<unknown>,
    event: any,
    expectedStatus: number,
    expectedMessage?: string,
) {
    try {
        await handler(event);
        expect.fail(`Handler expected to throw a ${expectedStatus} error`);
    } catch (error: any) {
        expect(error.statusCode).toBe(expectedStatus);

        if (expectedMessage) {
            expect(error.message).toBe(expectedMessage);
        }
    }
}

export async function handlerExpectStatusAsync(
    handler: Promise<any>,
    statusCode: number,
    validator?: (err: H3Error<any>) => void,
) {
    try {
        await handler;

        expect.fail(`Handler expected to throw error with status code ${statusCode}`);
    } catch (error) {
        if (!(error instanceof H3Error)) {
            expect.fail('Error not H3Error');
            // Returns
        }

        expect(error.statusCode).toBe(statusCode);
        validator?.(error); // If we need to check anything else about the error
    }
}
