<script setup lang="ts">
import { type DateRange } from 'reka-ui';

withDefaults(defineProps<{
    datePickerLabel: string
}>(), {
    datePickerLabel: 'Date',
});


const dateValue = defineModel<DateRange | null>('dateValue', {
    default: null,
});

const datePickerId = useId();
</script>

<template>
    <div class="flex flex-col gap-2">
        <Label 
            class="text-sm text-txt-primary" 
            :for="datePickerId">
            {{ datePickerLabel }}
        </Label>
        <DateRangePickerRoot 
            :id="datePickerId" 
            :week-starts-on="1"
            :granularity="'hour'"
            :number-of-months="2"
            :weekday-format="'short'"
            v-model="dateValue">
            <DateRangePickerField 
                v-slot="{ segments }"
                class="flex select-none items-center rounded-lg text-center p-1 
                    bg-slate-700 ring-md
                    data-invalid:border-red-500">
                <template 
                    v-for="item in segments.start"
                    :key="item.part">

                    <!-- the slashes between numbers -->
                    <DateRangePickerInput 
                        v-if="item.part === 'literal'"
                        :part="item.part"
                        type="start">
                        {{ item.value }}
                    </DateRangePickerInput>

                    <!-- the number inputs -->
                    <DateRangePickerInput 
                        v-else 
                        :part="item.part"
                        class="rounded-md p-0.5 focus:outline-none focus:ring-2 ring-black data-placeholder:text-main-500"
                        type="start">
                        {{ item.value }}
                    </DateRangePickerInput>
                </template>
                <span class="mx-2">
                    -
                </span>
                <template 
                    v-for="item in segments.end" 
                    :key="item.part">

                    <DateRangePickerInput 
                        v-if="item.part === 'literal'" 
                        :part="item.part" 
                        type="end">
                        {{ item.value }}
                    </DateRangePickerInput>

                    <DateRangePickerInput 
                        v-else 
                        :part="item.part"
                        class="rounded-md p-0.5 focus:outline-none focus:ring-2 ring-black data-placeholder:text-main-500"
                        type="end">
                        {{ item.value }}
                    </DateRangePickerInput>
                </template>

                <DateRangePickerTrigger class="ml-auto inline-flex focus:ring-2 ring-black focus:outline-none rounded-md p-1">
                    <Icon 
                        name="hugeicons:calendar-02" 
                        size="20" />
                </DateRangePickerTrigger>
            </DateRangePickerField>

            <DateRangePickerContent 
                :side-offset="4"
                class="rounded-xl bg-main-700 border border-main-500 shadow-sm
                will-change-[transform,opacity]
                data-[state=open]:data-[side=top]:animate-slideDownAndFade 
                data-[state=open]:data-[side=right]:animate-slideLeftAndFade 
                data-[state=open]:data-[side=bottom]:animate-slideUpAndFade 
                data-[state=open]:data-[side=left]:animate-slideRightAndFade">
                <DateRangePickerArrow class="fill-main-700 stroke-main-500" />
                
                <DateRangePickerCalendar 
                    v-slot="{ weekDays, grid }" 
                    class="p-4">
                    <DateRangePickerHeader class="flex items-center justify-between">
                        <DateRangePickerPrev
                            class="inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent size-7 hover:bg-main-600 active:scale-98 active:transition-all focus:ring-2 focus:ring-black">
                            <Icon 
                                name="hugeicons:arrow-left-01" 
                                class="size-4" />
                        </DateRangePickerPrev>

                        <DateRangePickerHeading class="text-sm font-medium select-none" />

                        <DateRangePickerNext
                            class="inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent size-7 hover:bg-main-600 active:scale-98 active:transition-all focus:ring-2 focus:ring-black">
                            <Icon 
                                name="hugeicons:arrow-right-01" 
                                class="size-4" />
                        </DateRangePickerNext>
                    </DateRangePickerHeader>
                    <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <DateRangePickerGrid 
                            v-for="month in grid" 
                            :key="month.value.toString()"
                            class="w-full border-collapse select-none space-y-1">

                            <!-- the "M T W T F S S" bit -->
                            <DateRangePickerGridHead>
                                <DateRangePickerGridRow class="mb-1 flex w-full justify-between">
                                    <DateRangePickerHeadCell 
                                        v-for="day in weekDays" 
                                        :key="day"
                                        class="w-8 rounded-md text-xs font-normal! text-txt-primary/50">
                                        {{ day }}
                                    </DateRangePickerHeadCell>
                                </DateRangePickerGridRow>
                            </DateRangePickerGridHead>

                            <!-- actual dates -->
                            <DateRangePickerGridBody>
                                <DateRangePickerGridRow 
                                    v-for="(weekDates, index) in month.rows"
                                    :key="`weekDate-${index}`" 
                                    class="flex w-full">
                                    <DateRangePickerCell 
                                        v-for="weekDate in weekDates" 
                                        :key="weekDate.toString()"
                                        :date="weekDate">
                                        <DateRangePickerCellTrigger 
                                            :day="weekDate" 
                                            :month="month.value"
                                            class="relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal size-8 outline-none 
                                            focus:ring-2 focus:ring-black
                                            data-outside-view:text-txt-primary/30
                                            data-selected:bg-sky-500! data-selected:text-main-900 
                                            hover:bg-sky-950
                                            data-highlighted:bg-sky-400/10
                                            data-unavailable:pointer-events-none data-unavailable:text-txt-primary/40 data-unavailable:line-through 
                                            before:absolute before:top-1.25 before:hidden before:rounded-full before:size-1 before:bg-main-500
                                            data-today:before:block data-today:before:bg-sky-500 " />
                                    </DateRangePickerCell>
                                </DateRangePickerGridRow>
                            </DateRangePickerGridBody>

                        </DateRangePickerGrid>
                    </div>
                </DateRangePickerCalendar>
            </DateRangePickerContent>
        </DateRangePickerRoot>
    </div>
</template>