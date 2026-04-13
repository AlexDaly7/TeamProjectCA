import { userService } from '~~/server/services';

export default defineAuthenticatedEventHandler(async (event) => {
    const user = event.context.user;

    return await userService.getGitHubIntegrationsStatus(user.id);
});
