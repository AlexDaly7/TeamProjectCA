import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockEvent } from '../utils/event';
import {
    PROJECT_MOCK,
    pusherMock,
    resetTaskApiMocks,
    servicesMock,
    setupTaskApiGlobals,
    TASK_BODY,
    TASK_WITH_PROJECT_MOCK,
    USER_MOCK,
} from '../mocks/taskApi';
import { expectHandlerError } from '../utils/handlerExpectStatus';

vi.mock('~~/server/services', () => servicesMock);
vi.mock('~~/server/lib/pusher', () => pusherMock);

describe('POST /api/projects/:id/tasks', () => {
    beforeEach(() => {
        vi.resetModules();
        resetTaskApiMocks();
        setupTaskApiGlobals();
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
            body: TASK_BODY,
        });

        await expectHandlerError(handler, event, 404, 'Project not found');

        expect(servicesMock.githubService.createIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.insertTask).not.toHaveBeenCalled();
        expect(pusherMock.notifyPusherChannel).not.toHaveBeenCalled();
    });

    it('returns 401 when the request has no authenticated user', async () => {
        const { default: handler } = await import('../../server/api/projects/[id]/tasks.post');
        const event = createMockEvent({
            params: { id: '123' },
            body: TASK_BODY,
        });

        await expectHandlerError(handler, event, 401, 'Unauthorized');

        expect(servicesMock.projectService.getByIdForUser).not.toHaveBeenCalled();
        expect(servicesMock.githubService.createIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.insertTask).not.toHaveBeenCalled();
    });

    it('returns 400 when an assignee is not in the project organization', async () => {
        servicesMock.projectService.getByIdForUser.mockResolvedValue(PROJECT_MOCK);

        const { default: handler } = await import('../../server/api/projects/[id]/tasks.post');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: String(PROJECT_MOCK.id) },
            body: {
                ...TASK_BODY,
                assigneeIds: ['outside-user'],
            },
        });

        await expectHandlerError(handler, event, 400, 'All assignees must be members of the project organization.');

        expect(servicesMock.userService.getGitHubLogins).not.toHaveBeenCalled();
        expect(servicesMock.githubService.createIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.insertTask).not.toHaveBeenCalled();
        expect(pusherMock.notifyPusherChannel).not.toHaveBeenCalled();
    });

    it('returns 204 when a task is created successfully', async () => {
        // Setup mocks
        servicesMock.projectService.getByIdForUser.mockResolvedValue(PROJECT_MOCK);
        servicesMock.userService.getGitHubLogins.mockResolvedValue([
            { userId: 'otheruserid', login: 'member-2-login' },
        ]);
        servicesMock.githubService.createIssue.mockResolvedValue({
            node_id: 'issue-node-1',
            number: 42,
        });
        servicesMock.taskService.insertTask.mockResolvedValue({
            data: { id: 777 },
            error: null,
        });

        const { default: handler } = await import('../../server/api/projects/[id]/tasks.post');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: String(PROJECT_MOCK.id) },
            body: {
                ...TASK_BODY,
                assigneeIds: ['member-2', 'member-2'],
            },
        });

        const result = await handler(event);

        expect(result).toBeUndefined();
        expect(servicesMock.projectService.getByIdForUser).toHaveBeenCalledWith(PROJECT_MOCK.id, USER_MOCK.id);

        // Expect we check for the other user
        expect(servicesMock.userService.getGitHubLogins).toHaveBeenCalledWith(['member-2']);

        // Expect that we created the GitHub issue
        expect(servicesMock.githubService.createIssue).toHaveBeenCalledWith(
            PROJECT_MOCK.repoOwner,
            PROJECT_MOCK.repoName,
            PROJECT_MOCK.id,
            {
                title: TASK_BODY.title,
                description: TASK_BODY.description,
                startTime: TASK_BODY.dateRange.start,
                endTime: TASK_BODY.dateRange.end,
                order: null,
                parentId: null,
            },
            USER_MOCK.name,
            ['member-2-login'],
        );

        // Expect that we run the task service's insert function with the actual data
        expect(servicesMock.taskService.insertTask).toHaveBeenCalledWith(
            {
                title: TASK_BODY.title,
                description: TASK_BODY.description,
                startTime: TASK_BODY.dateRange.start,
                endTime: TASK_BODY.dateRange.end,
                order: null,
                parentId: null,
                progress: TASK_BODY.progress,
                creatorId: USER_MOCK.id,
                ghIssueNodeId: 'issue-node-1',
                ghIssueNumber: 42,
                projectId: PROJECT_MOCK.id,
            },
            ['member-2'],
        );

        // Expect that we notify everyone in the pusher channel
        expect(pusherMock.notifyPusherChannel).toHaveBeenCalledWith(PROJECT_MOCK.id);
    });
});

describe('PATCH /api/tasks/:id', () => {
    beforeEach(() => {
        vi.resetModules();
        resetTaskApiMocks();
        setupTaskApiGlobals();
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    it("returns 404 when modifying a task that doesn't exist", async () => {
        servicesMock.taskService.getTaskWithProject.mockResolvedValue(undefined);

        const { default: handler } = await import('../../server/api/tasks/[id].patch');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: '999999' },
            body: TASK_BODY,
        });

        await expectHandlerError(handler, event, 404, 'Task not found');

        expect(servicesMock.githubService.updateIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.updateTask).not.toHaveBeenCalled();
        expect(pusherMock.notifyPusherChannel).not.toHaveBeenCalled();
    });

    it('returns 401 when the request has no authenticated user', async () => {
        const { default: handler } = await import('../../server/api/tasks/[id].patch');
        const event = createMockEvent({
            params: { id: String(TASK_WITH_PROJECT_MOCK.id) },
            body: TASK_BODY,
        });

        await expectHandlerError(handler, event, 401, 'Unauthorized');

        expect(servicesMock.taskService.getTaskWithProject).not.toHaveBeenCalled();
        expect(servicesMock.githubService.updateIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.updateTask).not.toHaveBeenCalled();
    });

    it('returns 400 when an assignee is not in the project organization', async () => {
        servicesMock.taskService.getTaskWithProject.mockResolvedValue(TASK_WITH_PROJECT_MOCK);
        servicesMock.projectService.getByIdForUser.mockResolvedValue(PROJECT_MOCK);

        const { default: handler } = await import('../../server/api/tasks/[id].patch');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: String(TASK_WITH_PROJECT_MOCK.id) },
            body: {
                ...TASK_BODY,
                assigneeIds: ['outside-user'],
            },
        });

        await expectHandlerError(handler, event, 400, 'All assignees must be members of the project organization.');

        expect(servicesMock.userService.getGitHubLogins).not.toHaveBeenCalled();
        expect(servicesMock.githubService.updateIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.updateTask).not.toHaveBeenCalled();
        expect(pusherMock.notifyPusherChannel).not.toHaveBeenCalled();
    });

    it('returns 204 when a task is updated successfully', async () => {
        servicesMock.taskService.getTaskWithProject.mockResolvedValue(TASK_WITH_PROJECT_MOCK);
        servicesMock.projectService.getByIdForUser.mockResolvedValue(PROJECT_MOCK);
        servicesMock.userService.getGitHubLogins.mockResolvedValue([{ userId: 'member-2', login: 'member-2-login' }]);
        servicesMock.taskService.updateTask.mockResolvedValue({
            data: null,
            error: null,
        });

        const { default: handler } = await import('../../server/api/tasks/[id].patch');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: String(TASK_WITH_PROJECT_MOCK.id) },
            body: {
                ...TASK_BODY,
                assigneeIds: ['member-2', 'member-2'],
                parentId: 44,
                order: 8,
            },
        });

        const result = await handler(event);

        expect(result).toBeUndefined();
        expect(servicesMock.taskService.getTaskWithProject).toHaveBeenCalledWith(TASK_WITH_PROJECT_MOCK.id);
        expect(servicesMock.projectService.getByIdForUser).toHaveBeenCalledWith(PROJECT_MOCK.id, USER_MOCK.id);
        expect(servicesMock.userService.getGitHubLogins).toHaveBeenCalledWith(['member-2']);
        expect(servicesMock.githubService.updateIssue).toHaveBeenCalledWith(
            PROJECT_MOCK.repoOwner,
            PROJECT_MOCK.repoName,
            PROJECT_MOCK.id,
            {
                ...TASK_WITH_PROJECT_MOCK,
                title: TASK_BODY.title,
                description: TASK_BODY.description,
                parentId: 44,
                startTime: TASK_BODY.dateRange.start,
                endTime: TASK_BODY.dateRange.end,
                progress: TASK_BODY.progress,
                order: 8,
            },
            USER_MOCK.name,
            TASK_WITH_PROJECT_MOCK,
            ['member-2-login'],
        );
        expect(servicesMock.taskService.updateTask).toHaveBeenCalledWith(
            TASK_WITH_PROJECT_MOCK.id,
            {
                title: TASK_BODY.title,
                description: TASK_BODY.description,
                parentId: 44,
                startTime: TASK_BODY.dateRange.start,
                endTime: TASK_BODY.dateRange.end,
                progress: TASK_BODY.progress,
                order: 8,
            },
            ['member-2'],
        );
        expect(pusherMock.notifyPusherChannel).toHaveBeenCalledWith(PROJECT_MOCK.id);
    });
});

describe('DELETE /api/tasks/:id', () => {
    beforeEach(() => {
        vi.resetModules();
        resetTaskApiMocks();
        setupTaskApiGlobals();
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    it("returns 404 when deleting a task that doesn't exist", async () => {
        servicesMock.taskService.getTaskWithProject.mockResolvedValue(undefined);

        const { default: handler } = await import('../../server/api/tasks/[id].delete');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: '999999' },
            method: 'DELETE',
        });

        await expectHandlerError(handler, event, 404, 'Task not found');

        expect(servicesMock.githubService.deleteIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.deleteTask).not.toHaveBeenCalled();
        expect(pusherMock.notifyPusherChannel).not.toHaveBeenCalled();
    });

    it('returns 401 when the request has no authenticated user', async () => {
        const { default: handler } = await import('../../server/api/tasks/[id].delete');
        const event = createMockEvent({
            params: { id: String(TASK_WITH_PROJECT_MOCK.id) },
            method: 'DELETE',
        });

        await expectHandlerError(handler, event, 401, 'Unauthorized');

        expect(servicesMock.taskService.getTaskWithProject).not.toHaveBeenCalled();
        expect(servicesMock.githubService.deleteIssue).not.toHaveBeenCalled();
        expect(servicesMock.taskService.deleteTask).not.toHaveBeenCalled();
    });

    it('returns 500 when deleting the GitHub issue fails', async () => {
        servicesMock.taskService.getTaskWithProject.mockResolvedValue(TASK_WITH_PROJECT_MOCK);
        servicesMock.githubService.deleteIssue.mockRejectedValue(new Error('GitHub delete failed'));

        // Suppress console.error — this test intentionally triggers a caught error in the handler
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { default: handler } = await import('../../server/api/tasks/[id].delete');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: String(TASK_WITH_PROJECT_MOCK.id) },
            method: 'DELETE',
        });

        try {
            await expectHandlerError(handler, event, 500, 'Internal Server Error');

            expect(servicesMock.taskService.getTaskWithProject).toHaveBeenCalledWith(TASK_WITH_PROJECT_MOCK.id);
            expect(servicesMock.githubService.deleteIssue).toHaveBeenCalledWith(
                PROJECT_MOCK.repoOwner,
                PROJECT_MOCK.repoName,
                TASK_WITH_PROJECT_MOCK.ghIssueNodeId,
            );
            expect(servicesMock.taskService.deleteTask).not.toHaveBeenCalled();
            expect(pusherMock.notifyPusherChannel).not.toHaveBeenCalled();
        } finally {
            consoleSpy.mockRestore();
        }
    });

    it('returns 500 when deleting the task in the database fails', async () => {
        servicesMock.taskService.getTaskWithProject.mockResolvedValue(TASK_WITH_PROJECT_MOCK);
        servicesMock.taskService.deleteTask.mockResolvedValue([]);

        const { default: handler } = await import('../../server/api/tasks/[id].delete');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: String(TASK_WITH_PROJECT_MOCK.id) },
            method: 'DELETE',
        });

        await expectHandlerError(handler, event, 500, 'There was a problem while deleting the task.');

        expect(servicesMock.githubService.deleteIssue).toHaveBeenCalledWith(
            PROJECT_MOCK.repoOwner,
            PROJECT_MOCK.repoName,
            TASK_WITH_PROJECT_MOCK.ghIssueNodeId,
        );
        expect(servicesMock.taskService.deleteTask).toHaveBeenCalledWith(TASK_WITH_PROJECT_MOCK.id);
        expect(pusherMock.notifyPusherChannel).not.toHaveBeenCalled();
    });

    it('returns 204 when a task is deleted successfully', async () => {
        servicesMock.taskService.getTaskWithProject.mockResolvedValue(TASK_WITH_PROJECT_MOCK);
        servicesMock.taskService.deleteTask.mockResolvedValue([{ id: TASK_WITH_PROJECT_MOCK.id }]);

        const { default: handler } = await import('../../server/api/tasks/[id].delete');
        const event = createMockEvent({
            user: USER_MOCK,
            params: { id: String(TASK_WITH_PROJECT_MOCK.id) },
            method: 'DELETE',
        });

        const result = await handler(event);

        expect(result).toBeUndefined();
        expect(servicesMock.taskService.getTaskWithProject).toHaveBeenCalledWith(TASK_WITH_PROJECT_MOCK.id);
        expect(servicesMock.githubService.deleteIssue).toHaveBeenCalledWith(
            PROJECT_MOCK.repoOwner,
            PROJECT_MOCK.repoName,
            TASK_WITH_PROJECT_MOCK.ghIssueNodeId,
        );
        expect(servicesMock.taskService.deleteTask).toHaveBeenCalledWith(TASK_WITH_PROJECT_MOCK.id);
        expect(pusherMock.notifyPusherChannel).toHaveBeenCalledWith(PROJECT_MOCK.id);
    });
});
