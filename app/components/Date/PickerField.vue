<script setup lang="ts">
import type { DateRange } from 'reka-ui';
import { parseDate } from "@internationalized/date";

const { value, setValue } = useField<{
    start?: Date,
    end?: Date,
}>('dateRange');

const rekaValue = computed<DateRange | undefined>({
    get() {
        return {
            start: value.value?.start
                ? parseDate(value.value.start.toISOString().split('T')[0]!)
                : undefined,
            end: value.value?.end
                ? parseDate(value.value.end.toISOString().split('T')[0]!)
                : undefined,
        }
    },
    set(nextValue) {
        setValue({
            start: nextValue?.start ? 
                new Date(
                    nextValue.start.year,
                    nextValue.start.month - 1,
                    nextValue.start.day,
                ) : undefined,
            end: nextValue?.end ? 
                new Date(
                    nextValue.end.year,
                    nextValue.end.month - 1,
                    nextValue.end.day,
                ) : undefined,
        }, true);
    },
})
</script>

<template>
    <DatePicker v-model="rekaValue" />
</template>