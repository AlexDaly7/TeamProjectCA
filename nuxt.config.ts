import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false }, // TODO: debug and find out why this throws warnings on projects page
    modules: [
        'nuxt-csurf',
        'reka-ui/nuxt',
        '@nuxt/icon',
        '@vee-validate/nuxt',
        '@nuxt/fonts',
        '@vercel/analytics'
    ],
    vite: {
        plugins: [
            tailwindcss()
        ],
    },
    css: [ '~/assets/css/main.css' ],
    routeRules: {
        '/dashboard/**': { appLayout: 'dashboard' },
    },

    app:{
        head:{
            title: 'Mórchlár',
            htmlAttrs: {
                lang: 'en',
            },
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
            ],
        }
    },

    runtimeConfig: {
        public: {
            betterAuthBaseUrl: '' // Overriden in envs
        }
    },

    fonts: {
        families: [ { name: 'Geist', provider: 'local' } ],
    }
});