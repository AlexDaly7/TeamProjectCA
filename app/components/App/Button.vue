<template>
    <button
        class="
            bg-slate-800 ring-1 ring-inset ring-slate-50/10 p-2 px-4 rounded-md cursor-pointer
            not-disabled:hover:bg-slate-700 not-disabled:hover:scale-102
            not-disabled:active:bg-slate-600 not-disabled:active:scale-98
            disabled:opacity-60
            transition-all duration-75">
        <slot />
    </button>
</template>