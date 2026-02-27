import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false }, // TODO: debug and find out why this throws warnings on projects page
    modules: ['nuxt-csurf', '@pinia/nuxt', 'reka-ui/nuxt', '@nuxt/icon'],
    vite: {
        plugins: [
            // @ts-expect-error - See https://github.com/tailwindlabs/tailwindcss/discussions/19655
            tailwindcss()
        ],
    },
    css: [ '~/assets/css/main.css' ],
    routeRules: {
        '/dashboard/**': { appLayout: 'dashboard' },
    },
});
