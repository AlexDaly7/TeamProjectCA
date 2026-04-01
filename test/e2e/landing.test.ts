import { describe, it, expect } from "vitest";
import { createPage, setup } from '@nuxt/test-utils/e2e'

describe('login page', async () => {
    await setup({
        host: 'http://localhost:3000',
    });

    it('displays the image', async () => {
        const page = await createPage('/')
        
        expect(await page.getByTestId('logo').isVisible()).toBe(true)
    });
})  