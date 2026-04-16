import { describe, it, expect } from 'vitest';
import { createPage, setup, url } from '@nuxt/test-utils/e2e';

describe('landing page', async () => {
    await setup({
        host: 'http://localhost:3000',
    });

    it('displays the hero image', async () => {
        const page = await createPage();
        await page.goto(url('/'), { waitUntil: 'hydration' });

        const heroImgVisible = await page.getByTestId('hero-img').isVisible();
        expect(heroImgVisible).toBe(true);
    });
});
