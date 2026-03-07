<template>
    <div class="flex flex-col gap-2">
        <SidebarLink
            :to="{ name: 'dashboard' }"
            label="My Organizations"
            icon="hugeicons:grid-view" />
        <SidebarLink
            :to="{ name: 'dashboard-account-profile' }"
            label="Account"
            icon="hugeicons:user-circle" />
    </div>
</template>