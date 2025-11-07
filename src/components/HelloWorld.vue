<template>
    <div>test</div>
    <button @click="weatherStore.fetchWeather('Hoddesdon')">Get Weather</button>
</template>

<script setup lang="ts">
import { useWeatherStore } from '../stores/weather-store';

const weatherStore = useWeatherStore();
</script>
