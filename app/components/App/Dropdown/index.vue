<script setup lang="ts"></script>

<template>
    <DropdownMenuRoot>
        <DropdownMenuTrigger :as-child="true">
            <slot name="trigger" />
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
            <DropdownMenuContent
                class="min-w-48 outline-none bg-main-700 shadow-sm shadow-black ring-md p-1 rounded-xl origin-(--reka-dropdown-menu-content-transform-origin) animate-scale-in"
                :side-offset="5">
                <slot name="content"></slot>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>
