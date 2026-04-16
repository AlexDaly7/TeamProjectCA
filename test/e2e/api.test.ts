import { describe, it, expect, vi } from 'vitest';
import { auth } from '../../server/lib/auth/auth';
import { setup, fetch } from '@nuxt/test-utils/e2e';

vi.mock('~~/server/lib/auth/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn(),
            listUserAccounts: vi.fn(),
        },
    },
}));

describe('GET /api/user/get-accounts', async () => {
    await setup({
        host: 'http://localhost:3000',
    });

    it('responds with 401 on no session', async () => {
        vi.mocked(auth.api.getSession).mockResolvedValue(null);

        const res = await fetch('/api/user/get-accounts');
        expect(res.status).toBe(401);
    });

    // it('responds with user list on authorized', async () => {
    //     vi.mocked(auth.api.listUserAccounts).mockResolvedValue([]);

    //     const res = await fetch('/api/user/get-accounts');
    //     console.log(await res.json());
    // });
});
