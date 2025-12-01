<script setup lang="ts">
import DropDownBody from './DropDownBody.vue';
</script>

<template>
    <header class="flex h-14 items-center justify-between md:h-18">
        <!-- logo -->
        <img src="/src/assets/images/logo.svg" alt="logo" class="h-7 lg:h-10" />

        <!-- Dropdown metrics -->
        <DropDownBody />
    </header>
</template>
