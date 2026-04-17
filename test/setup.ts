import { afterAll, beforeEach, vi } from 'vitest';

import './mocks/auth';

vi.stubGlobal("defineEventHandler", (func: any) => func);
vi.stubGlobal("sendRedirect", (func: any) => func);
//vi.stubGlobal("githubApp", (func: any) => func);

beforeEach(() => {
    vi.clearAllMocks();
});

afterAll(() => {
    vi.restoreAllMocks();
});
