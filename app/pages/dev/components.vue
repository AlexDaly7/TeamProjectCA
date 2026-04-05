<script setup lang="ts">
import type { ActionButtonResult } from '~/utils/types/actionButton';


const onAction = (success: boolean) => {
    return new Promise<ActionButtonResult>((resolve) => {
        setTimeout(() => {
            if (success) {
                resolve({ error: false });
            } else {
                resolve({ error: true, message: 'Something went wrong!' });
            }
        }, 2000);
    });
};
</script>

<template>
    <div class="flex flex-row gap-2 p-2">
        <AppActionButton 
            :action="() =>onAction(true)"
            :require-are-you-sure="true"
            variant="danger">
            <template #trigger>
                Danger Action Success
            </template>
        </AppActionButton>
        <AppActionButton 
            :action="() => onAction(false)"
            :require-are-you-sure="true"
            variant="danger">
            <template #trigger>
                Danger Action Fail
            </template>
        </AppActionButton>
    </div>
</template>