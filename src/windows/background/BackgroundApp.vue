<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { useBackgroundStore } from '@/stores/store.background'

const backgroundStore = useBackgroundStore()
// Decide which window should be launched first, based on whether a supported game is currently running
backgroundStore.setInitialWindow()
</script>
