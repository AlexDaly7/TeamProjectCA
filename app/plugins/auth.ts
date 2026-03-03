import type { UseFetchOptions } from "#app";
import { createAuthClient } from "better-auth/vue";
import { organizationClient } from "better-auth/client/plugins";

// Adapted: https://github.com/better-auth/better-auth/issues/5358#issuecomment-3411807797
const relativeFetch = (<T>(url: string, opts?: UseFetchOptions<T>) => {
    try {
        if (url.startsWith('http')) url = new URL(url).pathname;
    } catch {}
    return useFetch(url, opts);
});

export default defineNuxtPlugin(async () => {
    const { csrf } = useCsrf();

    const authClient = createAuthClient({
        baseURL: 'http://localhost:3000/api/auth',
        fetchOptions: {
            headers: {
                'csrf-token': csrf,
            },
        },
        plugins: [ organizationClient() ]
    });

    const session = await authClient.useSession(relativeFetch);

    return {
        provide: {
            authClient,
            authSession: session,
        },
    };
});