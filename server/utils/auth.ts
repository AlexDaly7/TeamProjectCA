import { auth } from "~~/lib/auth";

export async function getUserGitHubAuthToken(userId: string) {
    const token = await auth.api.getAccessToken({
        body: {
            providerId: 'github',
            userId,
        },
    });

    console.log(token);

    return token.accessToken;
}