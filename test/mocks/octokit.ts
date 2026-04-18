import { vi } from 'vitest';

export const mockInstallationOctokit = {
    graphql: vi.fn(),
    paginate: vi.fn(),
    rest: {
        issues: {
            update: vi.fn(),
            addSubIssue: vi.fn(),
            removeSubIssue: vi.fn(),
            listAssignees: vi.fn(),
        },
    },
};

vi.mock('~~/server/lib/octokit', (importOriginal) => {
    const original = importOriginal();
    return {
        default: {
            ...original,
            octokit: { rest: { apps: { getRepoInstallation: vi.fn() } } },
            getInstallationOctokit: vi.fn().mockResolvedValue(mockInstallationOctokit),
        },
    };
});
