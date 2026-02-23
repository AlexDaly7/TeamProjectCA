import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['nuxt-csurf', '@pinia/nuxt'],
    vite: {
        plugins: [
            // @ts-expect-error - See https://github.com/tailwindlabs/tailwindcss/discussions/19655
            tailwindcss()
        ],
    },
    css: [ './app/assets/css/main.css' ],
});
