<script setup lang="ts">
const props = withDefaults(defineProps<{
    name: string,
    required: boolean,
    disabled?: boolean,
    error?: string,
    min: number,
    max: number,
    step: number,
}>(), {
    disabled: false,
});

const name = toRef(props, 'name');

const { value, setValue } = useField<number>(name);

onMounted(() => {
    if (value.value === undefined) {
        setValue(props.min);
    }
});
</script>

<template>
    <SliderRoot
        class="relative flex items-center select-none touch-none w-full h-5"
        :name
        :required
        :disabled
        :min 
        :max
        :step
        :default-value="[ value ?? min ]"
        @update:model-value="(value) => setValue(value ? value[0] ?? 0 : 0)">
        <SliderTrack class="bg-main-700 relative grow rounded-full h-2">
            <SliderRange class="absolute bg-brand rounded-full h-full" />
        </SliderTrack>
        <SliderThumb
            class="block w-6 h-6 bg-main-50 rounded-full hover:bg-main-200 shadow-sm focus:outline-none focus:shadow-sm focus:shadow-black"
            :aria-label="name" />
    </SliderRoot>
    <span>{{ ((value ?? 0) * 100).toFixed(0) }}%</span>
</template>
