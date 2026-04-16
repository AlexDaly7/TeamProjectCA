import { vi, test, describe, mock, mockImplementation, expect, result } from 'vitest';
import { verifyGitHubRepoAccess } from '../../server/utils/github';
import { Octokit } from 'octokit';

vi.mock('octokit', () => {
    return {
        Octokit: vi.fn(),
    };
});
const mockGetData = vi.fn().mockResolvedValue({});

describe('/server/util/github.ts', () => {
    const ghToken = 222;
    const owner = 1;
    const repo = 2;
    Octokit.mockImplementation(() => ({
        rest: {
            repos: {
                get: mockGetData,
            },
        },
    }));

    test('IDk...', async () => {
        const result = await verifyGitHubRepoAccess(ghToken, owner, repo);
        expect(result).toStrictEqual({
            valid: false,
        });
    });
});
