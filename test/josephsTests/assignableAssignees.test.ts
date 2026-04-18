import {vi, expect, test, beforeEach, describe} from 'vitest';
import {getAssignableAssignees} from '../../server/services/githubService';

vi.mock('~~/server/lib/env', () => ({

    default: {}

}))

vi.mock('~~/server/lib/octokit', () => ({
    default: {}
}))

vi.mock('~~/server/lib/db/index', () => ({
    default: {}
}))

const mockOctokit = {

    paginate: vi.fn().mockResolvedValue([{login: 'James-Joyce'}, {login: 'Randy-Stix'}, {login: 'Nagito-Komaeda'}]),
    
    rest: {

        issues: {

            listAssignees: vi.fn()

        }
    }

}

describe("/server/service/githubService", () =>{

    test('assignee Usernames is undefined', async () => {

        const result = await getAssignableAssignees({}, 'James-Joyce', 'Ulysees-repo', undefined)

        await expect(result).toBe(undefined)

    })

    test('assignee Usernames is empty', async () => {

        const result = await getAssignableAssignees({}, 'James-Joyce', 'Ulysees-repo', [])

        await expect(result).toStrictEqual([])

    })

    test('assignee Username is in the array', async () => {

        const result = await getAssignableAssignees(mockOctokit, 'James-Joyce', 'Ulysees-repo', ['James-Joyce'])

        await expect(result).toStrictEqual(['James-Joyce'])

    })

    test('assignee Username is not in the array', async () => {

        const result = await getAssignableAssignees(mockOctokit, 'James-Joyce', 'Ulysees-repo', ['Makoto-Naegi'])

        await expect(result).toStrictEqual([])

    })

})