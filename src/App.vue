<script setup lang="ts">
import HeaderSite from './components/header/HeaderSite.vue';
import SearchBar from './components/SearchBar.vue';
import WeatherForecastLayout from './components/WeatherForecastLayout.vue';
</script>

<template>
    <main class="container">
        <HeaderSite />
        <SearchBar />
        <WeatherForecastLayout />
    </main>
</template>

<style scoped></style>
