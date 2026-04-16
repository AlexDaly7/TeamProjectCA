import { test, describe, vi, beforeEach } from 'vitest';
import * as authObj from '../../server/middleware/auth';

vi.mock(import('~~/server/lib/auth/auth'), () => {
    return {
        authObj,
    };
});

describe('/server/utils/auth.ts', () => {
    beforeEach(() => {
        console.log('FUCKYOU');
    });

    test('AGH', () => {
        console.log(authObj);

        expect().toStrictEqual();
    });
});
