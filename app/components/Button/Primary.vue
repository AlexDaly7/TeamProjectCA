<template>
    <button
        class="
            bg-txt-primary text-main-900 ring-md p-2 px-4 rounded-md cursor-pointer
            not-disabled:hover:bg-main-200 not-disabled:hover:scale-102
            not-disabled:active:bg-main-400 not-disabled:active:scale-98
            disabled:opacity-60 disabled:cursor-default
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-txt-secondary
            transition-all duration-75">
        <slot />
    </button>
</template>