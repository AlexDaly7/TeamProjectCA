<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';
import type { ButtonSize, ButtonType, ButtonVariant } from '~/utils/types/buttonTypes';

interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: ButtonType;
    disabled?: boolean;
    loading?: boolean;
    to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    href?: string;
    stateful?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    stateful: false,
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

const BASE_CLASSES = `cursor-pointer select-none
    focus-visible:outline-2 focus-visible:outline-offset-2
    disabled:opacity-60 disabled:cursor-default
    transition-colors duration-75`;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: `bg-txt-primary text-main-900 ring-md
        not-disabled:hover:bg-main-200
        not-disabled:active:bg-main-400
        focus-visible:outline-txt-secondary`,

    secondary: `bg-main-700 text-txt-primary ring-md
        not-disabled:hover:bg-main-600
        not-disabled:active:bg-main-800
        focus-visible:outline-txt-secondary`,

    tertiary: `bg-transparent text-txt-secondary
        not-disabled:hover:bg-main-600 not-disabled:hover:text-txt-primary
        not-disabled:active:bg-main-800
        focus-visible:outline-txt-secondary`,

    'tertiary-sidebar': `bg-transparent text-txt-secondary
        not-disabled:hover:bg-main-700 not-disabled:hover:text-txt-primary
        not-disabled:active:bg-main-600
        focus-visible:outline-txt-secondary`,

    danger: `bg-danger-bg text-danger-txt ring-md
        not-disabled:hover:bg-danger-bg-hover
        not-disabled:active:bg-main-400
        focus-visible:outline-danger-txt`,
};

const VARIANT_STATE_CLASSES: Record<ButtonVariant, string> = {
    primary: '',
    secondary: '',
    tertiary: '',
    'tertiary-sidebar': 'data-[state=open]:bg-main-700 data-[state=open]:ring-1 data-[state=open]:ring-inset data-[state=open]:ring-main-50/10',
    danger: '',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 rounded-md text-sm font-medium',
    'sm-even': 'p-2 rounded-md text-sm font-medium',
    md: 'px-4 py-2 rounded-md',
    'md-even': 'p-2 rounded-md',
    lg: '',
};

</script>

<template>
    <component
        :is="tag"
        :to
        :type="!(to || href) ? type : undefined"
        :disabled="tag === 'button' ? (disabled || loading) : undefined"
        :class="[BASE_CLASSES, VARIANT_CLASSES[variant], VARIANT_STATE_CLASSES[variant], SIZE_CLASSES[size]]"
        v-bind="externalProps"
        @click="!disabled && !loading && emit('click', $event)">
        <div 
            v-if="loading" 
            class="grid grid-cols-1 items-center justify-center"
            :class="{
                'min-h-5.5': size === 'sm',
                'min-h-6': size === 'md',
                'min-h-6.5': size === 'lg',
            }">
            <LoadingIcon 
                class="mx-auto"
                :size="20" />
        </div>
        <slot v-else></slot>
    </component>
</template>