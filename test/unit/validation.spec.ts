import { describe, it, expect } from "vitest";
import { z } from "zod";

import { validateBody, validateRouterParam } from "../../server/utils/validation";
import { createMockEvent } from "../utils/event";
import { handlerExpectStatusAsync, handlerExpectStatus } from "../utils/handlerExpectStatus";

describe("validateBody", () => {
    const TestSchema = z.object({
        name: z.string().min(1),
        age: z.number(),
    });

    it("returns data on correct validation", async () => {
        const body = { name: 'test', age: 18 };
        const validEvent = createMockEvent({ body });

        const result = await validateBody(validEvent, TestSchema);
        expect(result).toStrictEqual(body);
    });

    it("trims overloaded data", async () => {
        const body = { name: 'test', age: 18, description: 'bla' };
        const validEvent = createMockEvent({ body });

        const result = await validateBody(validEvent, TestSchema);
        expect(result).toStrictEqual({ name: 'test', age: 18 });
    });

    it("fails on incorrect data", async () => {
        const result = validateBody(createMockEvent({ body: {} }), TestSchema);
        await handlerExpectStatusAsync(result, 422);
    });

    it("fails on invalid data", async () => {
        const result = validateBody(createMockEvent({ body: undefined }), TestSchema);
        await handlerExpectStatusAsync(result, 422);
    });

    it("returns structured validation errors", async () => {
        const result = validateBody(createMockEvent({ body: { name: null, age: '18' } }), TestSchema);

        await handlerExpectStatusAsync(result, 422, (err) => {
            expect(Object.keys(err.data).length).toBe(2) // 2 errors

            expect(err.data).toHaveProperty('name'); // name is shown as invalid
            expect(err.data).toHaveProperty('age'); // age is shown as invalid
        });
    }); 
});

describe('validateRouterParam', () => {    
    it('validates required integer ids', () => {
        const event = createMockEvent({ params: { id: 4 }});

        const validated = validateRouterParam(event, 'id');
        expect(validated).toBe(4);
    });

    it('throws on non-integer params that need to be integers', () => {
        const event = createMockEvent({ params: { id: 'invalid string' }});

        handlerExpectStatus(() => validateRouterParam(event, 'id'), 400);
    });

    it('parses stringified integers back into a number', () => {
        const event = createMockEvent({ params: { id: '5' } })

        expect(validateRouterParam(event, 'id')).toBe(5);
    });

    it('allows 0 as a valid integer', () => {
        const event = createMockEvent({ params: { id: 0 } })

        expect(validateRouterParam(event, 'id')).toBe(0);
    });

    it('doesn\'t allow partial numbers', () => {
        const event = createMockEvent({ params: { id: 4.5 } })

        handlerExpectStatus(() => validateRouterParam(event, 'id'), 400);
    });

    it('accepts negative integers', () => {
        const event = createMockEvent({ params: { id: '-3' } });

        expect(validateRouterParam(event, 'id')).toBe(-3);
    });

    it ('parses string param when ensureInt is false', () => {
        const event = createMockEvent({ params: { id: 'test' } });

        expect(validateRouterParam(event, 'id', false)).toBe('test')
    });

    it ('throws 400 on no param', () => {
        const event = createMockEvent({ params: {} });

        handlerExpectStatus(() => validateRouterParam(event, 'id'), 400);
    });

    it('accept empty string as param', () => {
        const event = createMockEvent({ params: { id: '' } })

        expect(validateRouterParam(event, 'id', false)).toBe('');
    });
});