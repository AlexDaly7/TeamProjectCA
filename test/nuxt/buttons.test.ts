import { describe, expect, it } from "vitest";
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Primary from "~/components/Button/Primary.vue";

describe('ButtonPrimary', () => {
    it('displays the correct default text', async () => {
        const text = 'Click me!';
        
        const component = await mountSuspended(Primary, { slots: { default: text } });
        expect(component.text()).toBe(text);
    });
})