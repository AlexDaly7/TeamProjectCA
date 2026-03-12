export const useAuth = () => {
    const { $authClient, $authSession } = useNuxtApp();

    const user = computed(() => $authSession.data.value?.user);
    const isLoading = computed(() => $authSession.isPending);

    const signInWithGitHub = async () => {
        await $authClient.signIn.social({
            provider: 'github',
            scopes: [ 'user:email', 'repo' ],
            callbackURL: '/dashboard',
            errorCallbackURL: '/error',
        });
    };

    
    const listSessions = async () => {
        return await $authClient.listSessions();
    }

    const currentSessionToken = computed(() => $authSession.data.value?.session.token);

    async function grantGitHubPermissions() {
        return await $authClient.linkSocial({
            provider: 'github',
        });
    }

    async function signOut() {
        return await $authClient.signOut();
    }

    return {
        user,
        isLoading,

        signInWithGitHub,
        grantGitHubPermissions,

        listSessions,

        signOut,
        

        currentSessionToken,
    };
}