<template>
    <div class="my-6 text-white">
        <!-- Layout for the weather forecast -->
        <MainWeatherForecast
            :location="weatherStore.getCity"
            :todayDate="formattedDate"
            :todayTemperature="weatherStore.currentWeatherTemp"
            :temperatureUnit="weatherStore.currentWeatherUnit"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MainWeatherForecast from './MainWeatherForecast.vue';
import { useWeatherStore } from '../stores/weather-store';
import { useFormattedDate } from '../composables/useFormattedDate';

const weatherStore = useWeatherStore();
const { formatDate } = useFormattedDate();

const formattedDate = computed(() => {
    return formatDate(weatherStore.currentTimezone);
});

console.log(formattedDate.value);
</script>
