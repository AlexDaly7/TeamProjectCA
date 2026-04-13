<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';

type ListItem = {
    label: string;
    value: string;
    iconUrl?: string;
};

const props = withDefaults(
    defineProps<{
        name: string;
        required: boolean;
        placeholder: string;
        disabled?: boolean;
        error?: string;
        items: ListItem[];
        itemsPendingText?: string;
        itemsPendingErrorText?: string;
        multiple?: boolean;
    }>(),
    {
        disabled: false,
        multiple: false,
    },
);

const placeholderText = computed(() => {
    if (props.itemsPendingText) {
        return props.itemsPendingText;
    } else if (props.itemsPendingErrorText) {
        return props.itemsPendingErrorText;
    } else {
        return props.placeholder;
    }
});

const name = toRef(props, 'name');

const { value: inputValue, handleBlur, handleChange } = useField<AcceptableValue>(name);
</script>

<template>
    <SelectRoot
        :name
        :required
        :disabled
        :multiple
        :model-value="inputValue"
        @update:model-value="handleChange"
        @update:open="
            (o) => {
                if (!o) handleBlur();
            }
        ">
        <SelectTrigger
            class="inline-flex min-w-40 items-center justify-between rounded-lg px-4 leading-none h-8 gap-1 bg-main-700 ring-md data-disabled:text-txt-secondary outline-none"
            :disabled="!!itemsPendingErrorText">
            <SelectValue :placeholder="placeholderText" />
            <Icon name="hugeicons:arrow-down-01" class="size-3.5" />
        </SelectTrigger>

        <SelectPortal>
            <SelectContent
                class="min-w-40 overflow-hidden bg-main-700 ring-md rounded-lg shadow-sm z-100"
                :side-offset="5">
                <SelectScrollUpButton class="flex items-center justify-center h-6">
                    <Icon name="hugeicons:arrow-up-01" />
                </SelectScrollUpButton>

                <SelectViewport class="p-1">
                    <SelectItem
                        v-for="(item, index) in items"
                        :key="index"
                        class="leading-none rounded-md flex items-center h-8 pr-8 pl-6 relative select-none data-highlighted:outline-none data-highlighted:bg-main-200 data-highlighted:text-main-900"
                        :value="item.value">
                        <SelectItemIndicator class="absolute left-1 w-6 inline-flex items-center jusify-center">
                            <Icon name="hugeicons:tick-02" />
                        </SelectItemIndicator>
                        <SelectItemText class="inline-flex">
                            <img
                                v-if="item.iconUrl"
                                class="size-4 rounded-full mr-2"
                                :src="item.iconUrl"
                                referrerpolicy="no-referrer" />
                            <span>
                                {{ item.label }}
                            </span>
                        </SelectItemText>
                    </SelectItem>
                </SelectViewport>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>
