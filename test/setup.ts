import { afterAll, beforeEach, vi } from 'vitest';

import './mocks/auth';

beforeEach(() => {
    vi.clearAllMocks();
});

afterAll(() => {
    vi.restoreAllMocks();
});
