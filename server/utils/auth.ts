import { auth } from "~~/lib/auth";

export async function getUserGitHubAuthToken(userId: string) {
    const token = await auth.api.getAccessToken({
        body: {
            providerId: 'github',
            userId,
        },
    });

    return token.accessToken;
}