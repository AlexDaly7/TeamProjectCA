<script setup lang="ts">
const props = withDefaults(defineProps<{
    fieldName?: string;
    value?: string
    label?: string;
}>(), {
    fieldName: 'repo',
});


const { data, pending, error } = useFetch('/api/github/repos', { method: 'get', lazy: true });

const repos = computed(() => {
    if (pending.value || error.value || !data.value) return [];
    return data.value;
});

const placeholderText = computed(() => {
    if (pending.value) {
        return 'Loading repos...';
    } else if (error.value) {
        return `Error: ${error.value.message}`;
    } else if (!data.value) {
        return 'No repos found';
    } else {
        return 'Select a repo...'
    }
});

const value = defineModel('repo', {
    default: '',
});
</script>

<template>
    <div class="flex flex-col gap-1">
        <label 
            class="text-sm text-txt-secondary"
            :for="props.fieldName">
            {{ label }}
        </label>
        <SelectRoot :name="props.fieldName" v-model="value">
            <SelectTrigger
                class="inline-flex min-w-40 items-center justify-between 
                rounded-lg px-4 leading-none h-8 gap-1 bg-main-700 ring-md data-disabled:text-txt-secondary outline-none"
                aria-label="Customise options"
                :disabled="repos.length === 0">
                <SelectValue :placeholder="placeholderText" />
                <Icon name="hugeicons:arrow-down-01" class="size-3.5" />
            </SelectTrigger>

            <SelectPortal>
                <SelectContent
                    class="min-w-40 overflow-hidden bg-main-600 ring-md rounded-lg shadow-sm z-100"
                    :side-offset="5">
                    <SelectScrollUpButton class="flex items-center justify-center h-6">
                        <Icon name="hugeicons:arrow-up-01" />
                    </SelectScrollUpButton>

                    <SelectViewport class="p-1">
                        <SelectLabel class="px-6 text-sm leading-6 text-txt-secondary">
                            Repos
                        </SelectLabel>
                        <SelectGroup>
                            <SelectItem
                                v-for="(repo, index) in repos"
                                :key="index"
                                class="leading-none rounded-md flex items-center h-8 pr-8 pl-6 relative select-none
                                data-highlighted:outline-none data-highlighted:bg-main-200 data-highlighted:text-main-900"
                                :value="`${repo.owner}/${repo.name}`">
                                <SelectItemIndicator class="absolute left-1 w-6 inline-flex items-center jusify-center">
                                    <Icon name="hugeicons:tick-02" />
                                </SelectItemIndicator>
                                <SelectItemText class="inline-flex">
                                    <img
                                        class="size-4 rounded-full mr-2"
                                        :src="repo.icon"
                                        referrerpolicy="no-referrer" />
                                    <span>
                                        {{ repo.owner }}/{{ repo.name }}
                                    </span>
                                </SelectItemText>
                            </SelectItem>
                        </SelectGroup>
                    </SelectViewport>
                </SelectContent>
            </SelectPortal>
        </SelectRoot>
    </div>
</template>