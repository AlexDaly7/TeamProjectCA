export const SUPPORTED_OAUTH_PROVIDERS = [ 'github' ] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
    SupportedOAuthProvider,
    { name: string, icon: string }
> = {
    github: { name: 'GitHub', icon: 'hugeicons:github-01' }
};