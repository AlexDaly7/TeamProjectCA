<template>
    <div class="w-full h-36 flex flex-col">
        <div class="h-[1.9em] bg-(--timestamps-background)"></div>
        <div class="h-px bg-(--group-border-top)"></div>
        <div class="grow flex flex-col gap-2 items-center justify-center">
            <slot>Loading chart...</slot>
        </div>
    </div>
</template>
