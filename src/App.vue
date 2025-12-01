<template>
    <main class="container">
        <HeaderSite />
        <template v-if="weatherStore.error">
            <ErrorMessage />
        </template>
        <template v-else>
            <SearchBar />
            <template v-if="weatherStore.errorInput">
                <NoSearchResultsFoundMessage />
            </template>
            <template v-else>
                <WeatherForecastLayout />
            </template>
        </template>
    </main>
</template>

<script setup lang="ts">
import HeaderSite from './components/header/HeaderSite.vue';
import SearchBar from './components/SearchBar.vue';
import WeatherForecastLayout from './components/WeatherForecastLayout.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import { useWeatherStore } from './stores/weather-store';
import NoSearchResultsFoundMessage from './components/NoSearchResultsFoundMessage.vue';

const weatherStore = useWeatherStore();
</script>
