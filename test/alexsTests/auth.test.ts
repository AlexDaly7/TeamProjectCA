import { test, describe, vi, expect, toHaveBeenCalled, importOriginal, toHaveBeenCalledWith, beforeEach } from 'vitest';
import { auth } from '../mocks/auth';
import handler from '../../server/middleware/auth';
import { createMockEvent } from '../utils/event';
import * as h3 from 'h3';
import * as authModule from '../../server/lib/auth/auth';

// We must mock the auth.api request to return a valid / invalid user
vi.mock("~~/server/lib/auth/auth", () => {
    return {
        auth: {
            ...auth,
            api: {
                getSession: vi.fn()
            }
        }
    }
});

// Mock the h3 module so that we can mock sendRedirect within the middleware function
vi.mock("h3", async (importOriginal)=> {
    const original = await importOriginal("h3");
    return {
        ...original,
        sendRedirect: vi.fn(),
    }
});

describe('/server/utils/auth.ts', () => {
    test("User details present, accessing dashboard", async () => {
        //Import mocked sendRedirect function
        const { sendRedirect } = await import('h3');
        const event = createMockEvent({
            url: "/dashboard",
        });
        // Set value for auth.api.getSession (User)
        vi.mocked(authModule.auth.api.getSession).mockResolvedValue({
            user: {
                id: "1",
            }
        });

        // Call function
        const result = await handler(event);

        // No redirect takes place and nothing is returned as user is going to a proper route
        expect(result).toBeUndefined();
        expect(h3.sendRedirect).not.toHaveBeenCalled();
    });

    test('User details present, accessing root', async () => {
        // Import mocked sendRedirect function
        const { sendRedirect } = await import('h3');
        const event = createMockEvent({
            url: '/',
        });
        // Set value for auth.api.getSession (User)
        vi.mocked(authModule.auth.api.getSession).mockResolvedValue({
            user: {
                id: "1"
            }
        })

        // Call function 
        const result = await handler(event);

        // User is redirected to landing page as the landing page (root) is only accessible to users without accounts.
        expect(h3.sendRedirect).toHaveBeenCalledWith(event, "/dashboard", 302);
    });

    test("User details not present, accessing dashboard", async () => {
        //Import mocked sendRedirect function
        const { sendRedirect } = await import('h3');
        const event = createMockEvent({
            url: "/dashboard",
        });
        // Set no value for auth.api.getSession (User)
        vi.mocked(authModule.auth.api.getSession).mockResolvedValue("");

        // Call function
        const result = await handler(event);

        // User redirected as they cannot access dashboard without logging in
        expect(h3.sendRedirect).toHaveBeenCalledWith(event, "/", 302);
    });

    test("User details not present, accessing root", async () => {
        //Import mocked sendRedirect function
        const { sendRedirect } = await import('h3');
        const event = createMockEvent({
            url: "/",
        });
        // Set no value for auth.api.getSession (User)
        vi.mocked(authModule.auth.api.getSession).mockResolvedValue("");

        // Call function
        const result = await handler(event);

        // User is not redirected, as they are accessing the landing page (root), which they can access
        expect(result).toBeUndefined();
        expect(h3.sendRedirect).not.toHaveBeenCalled();
    });

    test("User details not present, accessing api route", async () => {
        //Import mocked sendRedirect function
        const { sendRedirect } = await import('h3');
        const event = createMockEvent({
            url: "/api/",
        });
        // Set no value for auth.api.getSession (User)
        vi.mocked(authModule.auth.api.getSession).mockResolvedValue("");

        // Call function
        const result = await handler(event);

        // User is not redirected as they are accessing an api route
        expect(result).toBeUndefined();
        expect(h3.sendRedirect).not.toHaveBeenCalled();
    });

    test("User details present, accessing api route", async () => {
        //Import mocked sendRedirect function
        const { sendRedirect } = await import('h3');
        const event = createMockEvent({
            url: "/api/",
        });
        // Set no value for auth.api.getSession (User)
        vi.mocked(authModule.auth.api.getSession).mockResolvedValue({
            user: {
                id: 1
            }
        });

        // Call function
        const result = await handler(event);

        // User is not redirected as they are accessing an api route
        expect(result).toBeUndefined();
        expect(h3.sendRedirect).not.toHaveBeenCalled();
    });
});

