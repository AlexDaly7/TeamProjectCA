export const useAuth =() => {
    const { $authClient, $authSession } = useNuxtApp();

    const user = computed(() => $authSession.data.value?.user);
    const isLoading = computed(() => $authSession.isPending);

    const signInWithGitHub = async () => {
        await $authClient.signIn.social({
            provider: 'github',
            callbackURL: '/dashboard',
            errorCallbackURL: '/error',
        });
    };

    return {
        user,
        isLoading,
        signInWithGitHub,
    };
}