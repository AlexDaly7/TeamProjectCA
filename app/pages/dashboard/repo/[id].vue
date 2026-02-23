<script setup lang="ts">
const route = useRoute();
</script>

<template>
    <div>
        ID: {{ route.params.id }}
    </div>
</template>