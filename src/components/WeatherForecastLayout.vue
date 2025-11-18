<template>
    <div class="my-6 text-white">
        <!-- Layout for the weather forecast -->
        <MainWeatherForecast
            :location="weatherStore.getCity"
            :country="weatherStore.getCountry"
            :todayDate="formattedDate"
            :todayTemperature="weatherStore.weatherTemp"
            :temperatureUnit="weatherStore.weatherUnit"
        />

        <div class="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CardComponent
                :title="'Feels like'"
                :currentWeatherAmount="weatherStore.apparentTemperature"
                :weatherUnit="weatherStore.weatherUnit"
            />

            <CardComponent
                :title="'Humidity'"
                :currentWeatherAmount="weatherStore.windSpeed"
                :weatherUnit="weatherStore.weatherUnit"
            />

            <CardComponent
                :title="'Wind'"
                :currentWeatherAmount="weatherStore.windSpeed"
                :weatherUnit="weatherStore.weatherUnit"
            />

            <CardComponent
                :title="'Precipitation'"
                :currentWeatherAmount="weatherStore.windSpeed"
                :weatherUnit="weatherStore.weatherUnit"
            />
        </div>

        <div>
            <h2 class="text-lg font-bold text-neutral-300">Daily forecast</h2>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MainWeatherForecast from './MainWeatherForecast.vue';
import { useWeatherStore } from '../stores/weather-store';
import { useFormattedDate } from '../composables/useFormattedDate';
import CardComponent from './CardComponent.vue';

const weatherStore = useWeatherStore();
const { formatDate } = useFormattedDate();

const formattedDate = computed(() => {
    return formatDate(weatherStore.timezone);
});

console.log(formattedDate.value);
</script>
