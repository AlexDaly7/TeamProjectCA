import { vi, describe, expect, it, importOriginal, toThrowError, resolves, test } from 'vitest';
import { createIssue } from '../../server/services/githubService';
import { Octokit, App } from 'octokit';
import githubApp from '../../server/lib/octokit';

const mockGraphql = vi.fn().mockResolvedValue('');
const MOCK_ISSUES_CREATE = vi.fn().mockResolvedValue({
    data: { id: 1, number: 1, node_id: 'node_1' },
});
const MOCK_ADD_SUB_ISSUE = vi.fn().mockResolvedValue({});

vi.mock('~~/server/services', () => ({
    taskService: {
        getTask: vi.fn().mockResolvedValue({ id: 1, ghIssueNumber: 2 }),
    },
}));

vi.mock('~~/server/utils/github/generateGithubIssue', () => ({
    generateGithubIssue: vi.fn().mockReturnValue({
        owner: 'owner',
        repo: 'repo',
        title: 'Test Issue',
    }),
}));

vi.mock('~~/server/lib/octokit', () => ({
    default: {
        octokit: {
            rest: {
                apps: {
                    getRepoInstallation: vi.fn(),
                },
            },
        },
        getInstallationOctokit: vi.fn(),
    },
}));

describe('githubService.ts createIssue()', () => {
    //fail first if
    it('Does not find the repo awaiting installation', async () => {
        //default data mock resolve used EVERYWHERE.
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({
            //null to fail
            data: null,
        } as any);

        //consistent and persistent result constant for creatIssue values
        const result = createIssue(
            'owner',
            'repo',
            1,
            { title: 'Test Issue', description: 'desc', startTime: null, endTime: null },
            'creatorName',
        );
        await expect(result).rejects.toThrow('Internal server error');
    });
    //call fail on seconds issue
    it('Fails to create a github issue', async () => {
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({
            data: { id: 1 },
        } as any);

        vi.mocked(githubApp.getInstallationOctokit).mockResolvedValue({
            graphql: mockGraphql,
            paginate: vi.fn().mockResolvedValue([]),
            rest: {
                issues: {
                    //force null to prompt a fail
                    create: vi.fn().mockResolvedValue(null),
                    addSubIssue: MOCK_ADD_SUB_ISSUE,
                },
            },
        } as any);

        const result = createIssue(
            'owner',
            'repo',
            1,
            { title: 'Test Issue', description: 'desc', startTime: null, endTime: null },
            'creatorName',
        );

        await expect(result).rejects.toThrow('Internal server error');
    });
    //pass parentId but manage to fail parent task exist
    it('Is assigned a parentId but no such parent exists', async () => {
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({
            data: { id: 1 },
        } as any);
        vi.mocked(githubApp.getInstallationOctokit).mockResolvedValue({
            graphql: mockGraphql,
            paginate: vi.fn().mockResolvedValue([]),
            rest: {
                issues: {
                    create: MOCK_ISSUES_CREATE,
                    addSubIssue: MOCK_ADD_SUB_ISSUE,
                },
            },
        } as any);

        const { taskService } = await import('~~/server/services');

        vi.mocked(taskService.getTask).mockResolvedValue(null);

        const result = createIssue(
            'owner',
            'repo',
            1,
            //assigned optional parentId
            { title: 'Test Issue', description: 'desc', startTime: null, endTime: null, parentId: 1 },
            'creatorName',
        );

        await expect(result).rejects.toThrow("Parent task doesn't exist.");
    });

    it('Has a valid parentId and parent task', async () => {
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({
            data: { id: 1 },
        } as any);

        //this one has to be const since we need to reference it for parent task(parentId is still just a variable since it's practically a index/address database reference)
        const mockInstallationOctokit = {
            graphql: mockGraphql,
            paginate: vi.fn().mockResolvedValue([]),
            rest: {
                issues: {
                    create: MOCK_ISSUES_CREATE,
                    addSubIssue: MOCK_ADD_SUB_ISSUE,
                },
            },
        };

        vi.mocked(githubApp.getInstallationOctokit).mockResolvedValue(mockInstallationOctokit as any);

        const { taskService } = await import('~~/server/services');
        //need a valid value since it actually does exist now and it's not a test phantom
        vi.mocked(taskService.getTask).mockResolvedValue({ id: 1, ghIssueNumber: 1 } as any);

        await createIssue(
            'owner',
            'repo',
            1,
            { title: 'Test Issue', description: 'desc', startTime: null, endTime: null, parentId: 1 },
            'creatorName',
        );

        expect(MOCK_ADD_SUB_ISSUE).toHaveBeenCalledWith({
            issue_number: 1,
            owner: 'owner',
            repo: 'repo',
            sub_issue_id: 1,
        });
    });
    it('Is given all valid inputs', async () => {
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({
            data: { id: 1 },
        } as any);
        vi.mocked(githubApp.getInstallationOctokit).mockResolvedValue({
            graphql: mockGraphql,
            paginate: vi.fn().mockResolvedValue([]),
            rest: {
                issues: {
                    create: MOCK_ISSUES_CREATE,
                    addSubIssue: MOCK_ADD_SUB_ISSUE,
                },
            },
        } as any);

        const { taskService } = await import('~~/server/services');

        vi.mocked(taskService.getTask).mockResolvedValue(null);

        const result = createIssue(
            'owner',
            'repo',
            1,
            //assigned optional parentId
            { title: 'Test Issue', description: 'desc', startTime: null, endTime: null },
            'creatorName',
        );

        await expect(result).resolves.toMatchObject({ id: 1, number: 1, node_id: 'node_1' });
    });
});
