import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createError } from 'h3';
import { createMockEvent } from '../utils/event';
import { type User } from 'better-auth';

const USER_MOCK: User = {
    createdAt: new Date(),
    email: 'user@example.com',
    emailVerified: true,
    id: 'exampleuserid',
    name: 'Example User',
    updatedAt: new Date(),
    image: null,
};

const servicesMock = vi.hoisted(() => ({
    projectService: {
        getByIdForUser: vi.fn(),
    },
    githubService: {
        createIssue: vi.fn(),
    },
    taskService: {
        insertTask: vi.fn(),
    },
    userService: {
        getGitHubLogins: vi.fn(),
    },
}));

vi.mock('~~/server/services', () => servicesMock);
vi.mock('~~/server/lib/pusher', () => ({
    notifyPusherChannel: vi.fn(),
}));

describe('POST /api/projects/:id/tasks', () => {
    beforeEach(() => {
        vi.resetModules();
        servicesMock.projectService.getByIdForUser.mockReset();
        servicesMock.githubService.createIssue.mockReset();
        servicesMock.taskService.insertTask.mockReset();
        servicesMock.userService.getGitHubLogins.mockReset();

        vi.stubGlobal('defineAuthenticatedEventHandler', (fn: (event: any) => any) => {
            return async (event: any) => {
                if (!event.context.user) {
                    throw createError({
                        statusCode: 401,
                        statusMessage: 'Unauthorized',
                    });
                }

                return fn(event);
            };
        });
        vi.stubGlobal('createError', createError);
        vi.stubGlobal('ensureOrganizationPermission', vi.fn());
        vi.stubGlobal('setResponseStatus', (event: any, statusCode: number) => {
            event.node.res.statusCode = statusCode;
        });
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    it("returns 404 when adding a task to a project that doesn't exist", async () => {
        servicesMock.projectService.getByIdForUser.mockResolvedValue(null);

        const { default: handler } = await import('../../server/api/projects/[id]/tasks.post');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: '999999' },
            body: {
                title: 'Any task',
                dateRange: {
                    start: new Date('2026-04-17T09:00:00.000Z'),
                    end: new Date('2026-04-17T10:00:00.000Z'),
                },
            },
        });

        try {
            await handler(event);
            expect.fail('Handler expected to throw a 404 error');
        } catch (error: any) {
            expect(error.statusCode ?? error.status).toBe(404);
            expect(error.statusMessage ?? error.statusText).toBe('Project not found');
        }

        expect(servicesMock.githubService.createIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.insertTask).not.toHaveBeenCalled();
    });
});
