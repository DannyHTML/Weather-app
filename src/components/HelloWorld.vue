<template>
    <input
        type="text"
        v-model="city"
        placeholder="Enter city name"
        class="rounded border-2 border-gray-300 p-2"
        @keypress="'Enter' === $event.key && weatherStore.fetchWeather(city)"
    />
    <button @click="weatherStore.fetchWeather(city)">Get Weather</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWeatherStore } from '../stores/weather-store';

const weatherStore = useWeatherStore();

const city = ref('');
</script>
