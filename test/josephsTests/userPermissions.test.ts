import{expect, test, describe, vi, beforeEach} from 'vitest';
import{ensureOrganizationPermission} from '../../server/utils/userPermission';
import { auth } from '~~/server/lib/auth/auth';
import type { H3Event } from 'h3';


vi.mock('~~/server/lib/env', () => ({

    default: {}

}))

vi.mock('~~/server/lib/auth/auth', () =>({

    auth: {

        api: {

            hasPermission: vi.fn(),

        },

    },

}));

vi.mock('h3', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        createError: vi.fn((opts) => new Error(opts.statusMessage)),
    };
});


const mockGetSession = vi.mocked(auth.api.hasPermission);


describe("/server/utils/userPermission", ()=> {

    beforeEach(() => {
        global.createError = vi.fn((opts) => new Error(opts.statusMessage));
    });

    test('The user does not have permissions', async () => {

        mockGetSession.mockResolvedValue({error: 'Unauthorized' as unknown as null, success: false})
        
        await expect(ensureOrganizationPermission({headers: {} } as H3Event, 'org-abc123', {organization: ['delete']})).rejects.toThrow('Unauthorized')


    })

    test('The user has permissions', async () => {

        mockGetSession.mockResolvedValue({error: null, success: true})
        
        await expect(ensureOrganizationPermission({headers: {} } as H3Event, 'org-abc123', {organization: ['delete']}))


    })

    beforeEach(() => {
        global.createError = vi.fn((opts) => new Error(opts.statusMessage));
    });

    test('The org does not exist', async () => {

        mockGetSession.mockResolvedValue({error: null, success: false})
        
        await expect(ensureOrganizationPermission({headers: {} } as H3Event, 'org-abc123', {organization: ['delete']})).rejects.toThrow('Organization not found')


    })
});
