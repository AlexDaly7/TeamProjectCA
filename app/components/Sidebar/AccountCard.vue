<script setup lang="ts">
const auth = useAuth();
const router = useRouter();

const popoverOpen = ref(false);

function onOpen(toOpen: boolean) {
    if (toOpen && auth.isLoading.value) {
        return;
    } else {
        popoverOpen.value = toOpen;
    }
}

async function signOut() {
    await auth.signOut();
    await router.push({ name: 'index' });
}
</script>

<template>
    <AppPopover 
        :is-open="popoverOpen"
        @update:is-open="onOpen">
        <template #trigger> 
            <div class="w-full p-2 rounded-lg inline-flex gap-2 items-center cursor-pointer select-none
                hover:bg-main-700 transition-all duration-75"
                :class="{ 'bg-main-700! ring-md': popoverOpen }">
                <template v-if="!auth.user.value">

                </template>
                <template v-else>
                    <AppAvatar
                        :image="auth.user.value.image ?? undefined"
                        :name="auth.user.value.name"
                        class="size-6!" />
                    <span>
                        {{ auth.user.value.name }}
                    </span>
                </template>
            </div>
        </template>

        <template #content>
            <div class="min-w-68">
                <div class="p-2">
                    <ButtonTertiary
                        bg-level="700"
                        class="w-full inline-flex justify-between items-center px-2!"
                        exact-active-class=""
                        :to="{ name: 'dashboard-account-profile' }"
                        @click="popoverOpen = false">
                        <div class="flex flex-col items-start">
                            <span>
                                {{ auth.user.value?.name }}
                            </span>
                            <span class="text-xs text-txt-secondary">
                                {{ auth.user.value?.email }}
                            </span>
                        </div>
                        <Icon 
                            name="hugeicons:account-setting-01"
                            size="20"
                            class="text-txt-secondary" />
                    </ButtonTertiary>
                </div>

                <div class="w-full h-px bg-main-50/10 mb-2"></div>

                <div class="flex flex-col gap-2 px-2 pb-2">
                    <ButtonTertiary 
                        bg-level="700"
                        class="inline-flex justify-between items-center px-2! text-sm"
                        @click="signOut">
                        <span>Sign Out</span>
                        <Icon 
                            name="hugeicons:logout-square-01" 
                            class="text-txt-secondary" />
                    </ButtonTertiary>
                </div>
            </div>
        </template>
    </AppPopover>
</template>