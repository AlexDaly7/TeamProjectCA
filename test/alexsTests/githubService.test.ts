import { vi, test, describe, expect } from 'vitest';
import { deleteIssue } from '../../server/services/githubService';
import { Octokit, App } from 'octokit';
import githubApp from '../../server/lib/octokit';

const mockGraphql = vi.fn().mockResolvedValue('');
const mockGraphql = vi.fn().mockResolvedValue('');

vi.mock(import('~~/server/services'), () => {
    return {};
});
vi.mock(import('~~/server/services'), () => {
    return {};
});

vi.mock(import('~~/server/lib/octokit'), (importOriginal) => {
    const original = importOriginal();
    return {
        default: {
            ...original,
            octokit: {
                rest: {
                    apps: {
                        getRepoInstallation: vi.fn(),
                    },
                },
            },
            getInstallationOctokit: vi.fn().mockResolvedValue({
                graphql: vi.fn(),
            }),
        },
    };
});

describe('githubService.ts deleteIssue()', async () => {
    test('No repo installation is found', async () => {
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({});

        vi.mocked(githubApp.getInstallationOctokit).mockResolvedValue({
            graphql: mockGraphql,
        });

        await expect(deleteIssue()).rejects.toThrow('Internal server error');
    });

    test('Repo installation is found', async () => {
        vi.mocked(githubApp.octokit.rest.apps.getRepoInstallation).mockResolvedValue({
            data: {
                id: '1',
            },
        });

        vi.mocked(githubApp.getInstallationOctokit).mockResolvedValue({
            graphql: mockGraphql,
        });
        const result = await deleteIssue();
        await expect(githubApp.getInstallationOctokit).toHaveBeenCalledWith('1');
    });
});
