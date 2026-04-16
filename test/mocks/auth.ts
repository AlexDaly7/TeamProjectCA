import { vi } from 'vitest';
import { auth } from '../../server/lib/auth/auth';
import { H3Event, H3EventContext } from 'h3';
import { User } from 'better-auth';

vi.mock('~~/server/lib/auth/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn(),
            listUserAccounts: vi.fn(),
        },
    },
}));

vi.mocked(auth.api.getSession).mockResolvedValue({
    session: {
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 100_000),
        id: 'sessionid',
        token: 'sessiontoken',
        userId: 'exampleuserid',
        activeOrganizationId: 'orgid1',
        ipAddress: '255.255.255.255',
        userAgent: 'Mozilla/5.0 MockUA 1.0',
    },
    user: {
        createdAt: new Date(),
        email: 'user@example.com',
        emailVerified: true,
        id: 'exampleuserid',
        name: 'Example User',
        updatedAt: new Date(),
        image: null,
    },
});

type AuthenticatedEvent = H3Event & {
    context: H3EventContext & {
        user: User;
    };
};

vi.mock('~~/server/utils/defineAuthenticatedEventHandler', () => ({
    default: (handler: (event: AuthenticatedEvent) => any) => {
        return async (event: any) => {
            event.context.user = {};
            return handler(event as AuthenticatedEvent);
        };
    },
}));
