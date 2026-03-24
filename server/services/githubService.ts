import { Octokit } from "octokit"

export const user = {
    getInfo: async (token: string) => {
        const userOctokit = new Octokit({ auth: token });
        const { data } = await userOctokit.rest.users.getAuthenticated();
        return data;
    }
};
