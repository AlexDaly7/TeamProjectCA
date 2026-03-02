<template>
    <div class="flex flex-col gap-2">
        <SidebarLink
            :to="{ name: 'dashboard' }"
            label="My Groups"
            icon="hugeicons:grid-view" />
        <SidebarLink
            :to="{ name: 'dashboard-account-profile' }"
            label="Account"
            icon="hugeicons:user-circle" />
        <SidebarLink
            :to="{ name: 'dashboard-settings' }"
            label="Settings"
            icon="hugeicons:settings-01" />
    </div>
</template>