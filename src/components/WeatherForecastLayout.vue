<template>
    <div class="my-6 text-white">
        <!-- Layout for the weather forecast -->
        <MainWeatherForecast
            :location="weatherStore.getCity"
            :country="weatherStore.getCountry"
            :todayDate="formattedDate"
            :todayTemperature="weatherStore.temperatureDisplay"
            :temperatureUnit="weatherStore.tempUnit"
        />

        <div class="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CardComponent
                :title="'Feels like'"
                :currentWeatherAmount="weatherStore.apparentTemperatureDisplay"
                :weatherUnit="weatherStore.tempUnit"
            />

            <CardComponent
                :title="'Humidity'"
                :currentWeatherAmount="weatherStore.humidity"
                :weatherUnit="'%'"
            />

            <CardComponent
                :title="'Wind'"
                :currentWeatherAmount="weatherStore.windSpeedDisplay"
                :weatherUnit="weatherStore.windUnit"
            />

            <CardComponent
                :title="'Precipitation'"
                :currentWeatherAmount="weatherStore.precipitationDisplay"
                :weatherUnit="weatherStore.precipitationUnit"
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
