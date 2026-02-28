<template>
    <button
        class="
            bg-main-700 text-txt-primary ring-md py-2 px-4 rounded-md cursor-pointer
            not-disabled:hover:bg-main-600 not-disabled:hover:scale-102
            not-disabled:active:bg-main-800 not-disabled:active:scale-98
            disabled:opacity-60 disabled:cursor-default
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-txt-secondary
            transition-all duration-75">
        <slot />
    </button>
</template>