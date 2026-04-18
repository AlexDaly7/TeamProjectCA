import { describe, it, expect } from 'vitest';
import { createPage, setup, url } from '@nuxt/test-utils/e2e';

describe('landing page', async () => {
    await setup({ dev: true });

    it('displays the hero image', async () => {
        const page = await createPage();
        await page.goto(url('/'), { waitUntil: 'hydration' });

        const heroImgVisible = await page.getByTestId('hero-img').isVisible();
        expect(heroImgVisible).toBe(true);
    });

    it('displays the hero image before hydration', async () => {
        const page = await createPage();
        await page.goto(url('/'), { waitUntil: 'domcontentloaded' });

        const heroImgVisible = await page.getByTestId('hero-img').isVisible();
        expect(heroImgVisible).toBe(true);
    });

    it("doesn't display the hero image on nonexistent page", async () => {
        const page = await createPage();
        await page.goto(url('/notarealpage'), { waitUntil: 'domcontentloaded' });

        const heroImgVisible = await page.getByTestId('hero-img').isVisible();
        expect(heroImgVisible).toBe(false);
    });

    it('displays the image even on js disabled', async () => {
        const page = await createPage('/', { javaScriptEnabled: false });
        await page.goto(url('/'), { waitUntil: 'domcontentloaded' });

        const heroImgVisible = await page.getByTestId('hero-img').isVisible();
        expect(heroImgVisible).toBe(true);
    });
});
