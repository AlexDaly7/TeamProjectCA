import { describe, expect, it } from "vitest";
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from "~/components/App/Button.vue";

describe('AppButton', () => {
    it('displays the correct default text', async () => {
        const text = 'Click me!';
        
        const component = await mountSuspended(Button, { slots: { default: text } });
        expect(component.text()).toBe(text);
    });
})