import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import path from 'path';

const resolve = {
    alias: {
        '~~': path.resolve(__dirname, './'),
    },
};

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'unit',
                    include: ['test/unit/*.{test,spec}.ts'],
                    environment: 'node',
                },
                resolve,
            },
            {
                test: {
                    name: 'e2e',
                    include: ['test/e2e/*.{test,spec}.ts'],
                    environment: 'node',
                    setupFiles: ['./test/setup.ts'],
                },
                resolve,
            },
            {
                test: {
                    name: 'alexsTests',
                    include: ['test/alexsTests/*.{test,spec}.ts'],
                    environment: 'node',
                    setupFiles: ['./test/setup.ts'],
                },
                resolve,
            },
            await defineVitestProject({
                test: {
                    name: 'nuxt',
                    include: ['test/nuxt/*.{test,spec}.ts'],
                    environment: 'nuxt',
                },
                resolve,
            }),
        ],
    },
});
