<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: ButtonType;
    disabled?: boolean;
    loading?: boolean;
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
});

const emit = defineEmits<{
    click: [event: MouseEvent],
}>();

const tag = computed(() => {
    if (props.to) return resolveComponent('NuxtLink');
    if (props.href) return 'a';
    return 'button';
});

// For external links, add these to ensure safety.
const externalProps = computed(() =>
    props.href ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' } : {}
);

const BASE_CLASSES = `ring-md cursor-pointer select-none
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-txt-secondary
    disabled:opacity-60 disabled:cursor-default
    transition-colors duration-75`;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: `bg-txt-primary text-main-900
        not-disabled:hover:bg-main-200
        not-disabled:active:bg-main-400`,
    secondary: `bg-main-700 text-txt-primary
        not-disabled:hover:bg-main-600
        not-disabled:active:bg-main-800`,
    tertiary: '',
    danger: '',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: '',
    md: 'px-4 py-2 rounded-md',
    lg: '',
};

</script>

<template>
    <component
        :is="tag"
        :to
        :type="!(to || href) ? type : undefined"
        :disabled="tag === 'button' ? (disabled || loading) : undefined"
        :class="[BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size]]"
        v-bind="externalProps"
        @click="!disabled && !loading && emit('click', $event)">
        <LoadingSwap :is-loading="loading">
            <slot />
        </LoadingSwap>
    </component>
</template>