<template>
    <div class="flex flex-col gap-2">
        <SidebarLink :to="{ name: 'dashboard-account-profile' }" label="Profile" icon="hugeicons:user" />

        <SidebarLink :to="{ name: 'dashboard-account-security' }" label="Security" icon="hugeicons:shield-01" />

        <SidebarLink :to="{ name: 'dashboard-account-sessions' }" label="Sessions" icon="hugeicons:key-01" />

        <SidebarLink :to="{ name: 'dashboard-account-github' }" label="GitHub" icon="hugeicons:github-01" />

        <SidebarLink :to="{ name: 'dashboard-account-danger' }" label="Danger" icon="hugeicons:alert-01" />
    </div>
</template>
