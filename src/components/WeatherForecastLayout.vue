<template>
    <div class="my-6 text-white">
        <!-- Layout for the weather forecast -->
        <MainWeatherForecast
            :location="weatherStore.getCity"
            :country="weatherStore.getCountry"
            :todayDate="formattedDate"
            :todayTemperature="weatherStore.currentWeatherTemp"
            :temperatureUnit="weatherStore.currentWeatherUnit"
        />

        <div class="my-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ExtraWeatherInfoLayout
                v-for="data in dummyData"
                :key="data.id"
                :title="data.title"
                :currentWeatherAmount="data.currentWeatherAmount"
                :weatherUnit="data.weatherUnit"
            />
        </div>

        <div>test</div>

        <div class="my-3 grid grid-cols-3 gap-3 sm:grid-cols-7">
            <ExtraWeatherInfoLayout
                v-for="data in dummyData"
                :key="data.id"
                :title="data.title"
                :currentWeatherAmount="data.currentWeatherAmount"
                :weatherUnit="data.weatherUnit"
                :image="data.image"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MainWeatherForecast from './MainWeatherForecast.vue';
import { useWeatherStore } from '../stores/weather-store';
import { useFormattedDate } from '../composables/useFormattedDate';
import ExtraWeatherInfoLayout from './ExtraWeatherInfoLayout.vue';

const dummyData = [
    {
        title: 'Feels like',
        currentWeatherAmount: 18,
        weatherUnit: '°',
        image: '/src/assets/images/icon-rain.webp',
        id: 1,
    },
    {
        title: 'Humidity',
        currentWeatherAmount: 46,
        weatherUnit: '%',
        image: '/src/assets/images/icon-sunny.webp',
        id: 2,
    },
    {
        title: 'Wind',
        currentWeatherAmount: 14,
        weatherUnit: 'km/h',
        id: 3,
    },
    {
        title: 'precipitation',
        currentWeatherAmount: 0,
        weatherUnit: 'mm',
        id: 4,
    },
];

const weatherStore = useWeatherStore();
const { formatDate } = useFormattedDate();

const formattedDate = computed(() => {
    return formatDate(weatherStore.currentTimezone);
});

console.log(formattedDate.value);
</script>
