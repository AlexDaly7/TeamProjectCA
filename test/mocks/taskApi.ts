import { createError } from 'h3';
import type { User } from 'better-auth';
import { vi } from 'vitest';

export const USER_MOCK: User = {
    createdAt: new Date(),
    email: 'user@example.com',
    emailVerified: true,
    id: 'exampleuserid',
    name: 'Example User',
    updatedAt: new Date(),
    image: null,
};

export const PROJECT_MOCK = {
    id: 123,
    organizationId: 'org-1',
    repoOwner: 'acme',
    repoName: 'roadmap',
    organization: {
        members: [{ userId: USER_MOCK.id }, { userId: 'member-2' }],
    },
};

export const TASK_WITH_PROJECT_MOCK = {
    id: 456,
    title: 'Existing task',
    description: 'Existing description',
    parentId: null,
    startTime: new Date('2026-04-12T00:00:00.000Z'),
    endTime: new Date('2026-04-16T00:00:00.000Z'),
    progress: 0.5,
    order: 2,
    project: PROJECT_MOCK,
    creator: {
        id: USER_MOCK.id,
        name: USER_MOCK.name,
    },
};

export const TASK_BODY = {
    title: 'Any task',
    description: 'Task description',
    dateRange: {
        start: new Date('2026-04-16T00:00:00.000Z'),
        end: new Date('2026-04-24T10:00:00.000Z'),
    },
    progress: 0.25,
};

export const servicesMock = {
    projectService: {
        getByIdForUser: vi.fn(),
    },
    githubService: {
        createIssue: vi.fn(),
        updateIssue: vi.fn(),
    },
    taskService: {
        insertTask: vi.fn(),
        getTaskWithProject: vi.fn(),
        updateTask: vi.fn(),
    },
    userService: {
        getGitHubLogins: vi.fn(),
    },
};

export const pusherMock = {
    notifyPusherChannel: vi.fn(),
};

export function resetTaskApiMocks() {
    servicesMock.projectService.getByIdForUser.mockReset();
    servicesMock.githubService.createIssue.mockReset();
    servicesMock.githubService.updateIssue.mockReset();
    servicesMock.taskService.insertTask.mockReset();
    servicesMock.taskService.getTaskWithProject.mockReset();
    servicesMock.taskService.updateTask.mockReset();
    servicesMock.userService.getGitHubLogins.mockReset();
    pusherMock.notifyPusherChannel.mockReset();
}

export function setupTaskApiGlobals() {
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
}
