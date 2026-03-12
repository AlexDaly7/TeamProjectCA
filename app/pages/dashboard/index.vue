<script setup lang="ts">
definePageMeta({
    sidebarType: 'user',
    middleware: [ 'dashboard' ],
});

</script>

<template>
    <div class="flex items-center justify-center h-full text-txt-secondary">
        Create a new organization from the top-left dropdown, or check pending invites to accept organization invites.
    </div>
</template>