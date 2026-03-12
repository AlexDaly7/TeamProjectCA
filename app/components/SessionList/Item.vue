<script setup lang="ts">
import type { ApiResponse } from "~/composables/apiResponse";
import { UAParser } from 'ua-parser-js';

const props = withDefaults(defineProps<{
    session: ApiResponse<"/api/user/get-sessions", "get">[number],
    isCurrentSession?: boolean,
}>(), {
    isCurrentSession: false,
});

const userAgentInfo = computed(() => props.session.userAgent ? UAParser(props.session.userAgent) : null);

function getBrowserInformation(userAgent: UAParser.IResult | null) {
    if (!userAgent) return "Unknown Device";

    if (userAgent.browser.name === null && userAgent.os.name == null) {
        return "Unknown Device";
    }

    if (userAgent.browser.name === null) return userAgent.os.name;
    if (userAgent.os.name === null) return userAgent.browser.name;

    return `${userAgent.browser.name}, ${userAgent.os.name}`;
}

defineEmits<{
    (e: 'revokeSession'): void,
}>();
</script>

<template>
    <div class="ring-md w-full flex flex-col gap-4 p-4 rounded-xl">
        <div class="flex flex-row justify-between">
            <span class="text-lg font-bold">
                {{ getBrowserInformation(userAgentInfo) }}
            </span>
            <span 
                v-if="isCurrentSession"
                class="text-sm bg-txt-primary text-main-900 p-1 rounded-md px-2">
                Current Session
            </span>
        </div>
        <div class="flex flex-row gap-4">
            <Icon
                :name="userAgentInfo?.device.type === 'mobile' ? 'hugeicons:smart-phone-01' : 'hugeicons:computer'"
                size="48"
                class="my-auto" />
            <div class="flex flex-col text-txt-secondary">
                <span>
                    Created: {{ session.createdAt.toLocaleString() }}
                </span>
                <span>
                    Expires: {{ session.expiresAt.toLocaleString() }}
                </span>
            </div>
            <ButtonDanger 
                v-if="!isCurrentSession" 
                class="ml-auto inline-flex items-center justify-center"
                @click="$emit('revokeSession')">
                <Icon name="hugeicons:delete-02" size="20" />
            </ButtonDanger>
        </div> 
    </div>
</template>