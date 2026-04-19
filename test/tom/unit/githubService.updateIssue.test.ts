import '../../mocks/octokit'; // We also want the side effects
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateIssue } from '../../../server/services/githubService';
import githubApp from '../../../server/lib/octokit';
import { mockInstallationOctokit } from '../../mocks/octokit';
import { taskService } from '../../../server/services';
import { generateGithubIssue } from '../../../server/utils/github/generateGithubIssue';

vi.mock('~~/server/services', () => ({
    taskService: { getTask: vi.fn() },
}));

vi.mock('~~/server/utils/github/generateGithubIssue', () => ({
    generateGithubIssue: vi.fn().mockReturnValue({}),
}));

const BASE_PREV_VALUES = {
    title: 'Old title',
    description: 'Old desc',
    parentId: null,
    startTime: null,
    endTime: null,
    order: 0,
    creatorId: 'user-1',
    ghIssueNodeId: '100',
    ghIssueNumber: 10,
    projectId: 1,
    progress: 0,
};

const BASE_VALUES = {
    title: 'New title',
    description: 'New desc',
    parentId: null,
    startTime: null,
    endTime: null,
    order: 0,
    progress: 0,
};

function setupHappyPathMocks(updatedIssueId = 42) {
    vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({ data: { id: 1 } } as any);
    vi.mocked(githubApp.getInstallationOctokit).mockResolvedValue(mockInstallationOctokit as any);
    vi.mocked(mockInstallationOctokit.rest.issues.update).mockResolvedValue({ data: { id: updatedIssueId } } as any);
}

describe('githubService updateIssue()', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(generateGithubIssue).mockReturnValue({} as any);
    });

    it('throws 500 when no repo installation is found', async () => {
        // GitHub App isn't installed on this repo
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({} as any);

        await expect(updateIssue('owner', 'repo', 1, BASE_VALUES, 'creator', BASE_PREV_VALUES)).rejects.toThrow(
            'Internal server error',
        );
    });

    it('returns updated issue data on successful update', async () => {
        setupHappyPathMocks();

        const result = await updateIssue('owner', 'repo', 1, BASE_VALUES, 'creator', BASE_PREV_VALUES);

        expect(mockInstallationOctokit.rest.issues.update).toHaveBeenCalledOnce();
        expect(result).toEqual({ id: 42 });
    });

    it('closes the issue when progress is 1', async () => {
        setupHappyPathMocks();

        await updateIssue('owner', 'repo', 1, { ...BASE_VALUES, progress: 1 }, 'creator', BASE_PREV_VALUES);

        expect(mockInstallationOctokit.rest.issues.update).toHaveBeenCalledWith(
            expect.objectContaining({ state: 'closed', state_reason: 'completed' }),
        );
    });

    it('reopens the issue when progress is 0', async () => {
        setupHappyPathMocks();

        await updateIssue('owner', 'repo', 1, { ...BASE_VALUES, progress: 0 }, 'creator', BASE_PREV_VALUES);

        expect(mockInstallationOctokit.rest.issues.update).toHaveBeenCalledWith(
            expect.objectContaining({ state: 'open', state_reason: 'reopened' }),
        );
    });

    it('passes only assignable usernames through to the issue', async () => {
        // 'bob' isn't in the repo's assignable list, so he should be filtered out
        setupHappyPathMocks();
        vi.mocked(mockInstallationOctokit.paginate).mockResolvedValue([{ login: 'alice' }, { login: 'carol' }]);

        await updateIssue('owner', 'repo', 1, BASE_VALUES, 'creator', BASE_PREV_VALUES, ['alice', 'bob']);

        expect(vi.mocked(generateGithubIssue)).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ assigneeUsernames: ['alice'] }),
            expect.anything(),
        );
    });

    it('clears assignees when an empty array is passed', async () => {
        setupHappyPathMocks();

        await updateIssue('owner', 'repo', 1, BASE_VALUES, 'creator', BASE_PREV_VALUES, []);

        expect(vi.mocked(generateGithubIssue)).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ assigneeUsernames: [] }),
            expect.anything(),
        );
    });

    it('falls back to prevValues.progress when values.progress is undefined', async () => {
        // e.g. a partial update that doesn't touch progress — the old value should still drive open/closed
        setupHappyPathMocks();

        await updateIssue('owner', 'repo', 1, { ...BASE_VALUES, progress: undefined }, 'creator', {
            ...BASE_PREV_VALUES,
            progress: 1,
        });

        expect(mockInstallationOctokit.rest.issues.update).toHaveBeenCalledWith(
            expect.objectContaining({ state: 'closed', state_reason: 'completed' }),
        );
    });

    it('uses prevValues fields when values fields are undefined', async () => {
        setupHappyPathMocks();

        await updateIssue(
            'owner',
            'repo',
            1,
            { ...BASE_VALUES, title: undefined, description: undefined },
            'creator',
            BASE_PREV_VALUES,
        );

        expect(vi.mocked(generateGithubIssue)).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ title: 'Old title', description: 'Old desc' }),
            expect.anything(),
        );
    });

    it('calls removeSubIssue when parentId is cleared', async () => {
        setupHappyPathMocks();
        vi.mocked(taskService.getTask).mockResolvedValue({ ghIssueNumber: 99 } as any);

        await updateIssue('owner', 'repo', 1, { ...BASE_VALUES, parentId: null }, 'creator', {
            ...BASE_PREV_VALUES,
            parentId: 5,
        });

        expect(mockInstallationOctokit.rest.issues.removeSubIssue).toHaveBeenCalledWith(
            expect.objectContaining({ issue_number: 99 }),
        );
    });

    it('throws 400 when the previous parent task no longer exists', async () => {
        setupHappyPathMocks();
        vi.mocked(taskService.getTask).mockResolvedValue(undefined);

        await expect(
            updateIssue('owner', 'repo', 1, { ...BASE_VALUES, parentId: null }, 'creator', {
                ...BASE_PREV_VALUES,
                parentId: 5,
            }),
        ).rejects.toThrow("Previous parent task doesn't exist.");
    });

    it('calls addSubIssue when a new parentId is set', async () => {
        setupHappyPathMocks(200);
        vi.mocked(taskService.getTask).mockResolvedValue({ ghIssueNumber: 55 } as any);

        await updateIssue('owner', 'repo', 1, { ...BASE_VALUES, parentId: 7 }, 'creator', {
            ...BASE_PREV_VALUES,
            parentId: null,
        });

        expect(mockInstallationOctokit.rest.issues.addSubIssue).toHaveBeenCalledWith(
            expect.objectContaining({ issue_number: 55, sub_issue_id: 200 }),
        );
    });

    it('throws 400 when the new parent task does not exist', async () => {
        setupHappyPathMocks();
        vi.mocked(taskService.getTask).mockResolvedValue(undefined);

        await expect(
            updateIssue('owner', 'repo', 1, { ...BASE_VALUES, parentId: 7 }, 'creator', {
                ...BASE_PREV_VALUES,
                parentId: null,
            }),
        ).rejects.toThrow("Parent task doesn't exist.");
    });
});
