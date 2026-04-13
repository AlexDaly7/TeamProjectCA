import { githubService } from '.';
import githubApp from '../lib/octokit';
import { userRepository } from '../repositories';

type UserGitHubIntegrationStatus =
    | {
          status: 'not_connected';
          manageUrl: string;
      }
    | {
          status: 'oauth_connected';
          manageUrl: string;
      }
    | {
          status: 'app_connected';
          selectedRepositories: 'all' | 'selected';
          availableRepositories: { owner: string; repo: string; image: string }[];
          manageUrl: string;
      };

export async function getGitHubIntegrationsStatus(userId: string): Promise<UserGitHubIntegrationStatus> {
    // Get the app integration's management URL
    const installationUrl = await githubApp.getInstallationUrl();

    // Get their GitHub OAuth info from the DB
    const userGhAccount = await userRepository.getGithubAccount(userId);
    if (!userGhAccount || !userGhAccount.accessToken)
        return {
            status: 'not_connected',
            manageUrl: installationUrl,
        };

    // Fetch their username using the GitHub service
    const ghUserInfo = await githubService.user.getInfo(userGhAccount.accessToken);

    // Get the morchlar GitHub app's installation for that user
    const { data, error } = await tryCatch(
        githubApp.octokit.rest.apps.getUserInstallation({ username: ghUserInfo.login }),
    );

    if (error) {
        console.log('Error getting GitHub app integration in userService', error);
        return { status: 'oauth_connected', manageUrl: installationUrl };
    }

    let allRepos: { owner: string; repo: string; image: string }[] = [];
    await githubApp.eachRepository({ installationId: data.data.id }, ({ repository }) => {
        allRepos.push({
            owner: repository.owner.login,
            repo: repository.name,
            image: repository.owner.avatar_url,
        });
    });

    return {
        status: 'app_connected',
        selectedRepositories: data.data.repository_selection,
        availableRepositories: allRepos,
        manageUrl: installationUrl,
    };
}

export async function getGitHubLogins(userIds: string[]) {
    const githubAccounts = await userRepository.getGithubAccounts([...new Set(userIds)]);

    const githubUsers = await Promise.all(
        githubAccounts
            .filter((account) => account.accessToken)
            .map(async (account) => ({
                userId: account.userId,
                login: (await githubService.user.getInfo(account.accessToken!)).login,
            })),
    );

    return githubUsers;
}
