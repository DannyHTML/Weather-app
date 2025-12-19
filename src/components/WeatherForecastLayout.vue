<template>
    <div class="my-6 grid-cols-12 gap-5 text-white lg:grid">
        <!-- Hourly forecast section -->
        <div class="col-span-8">
            <!-- Layout for the weather forecast -->
            <MainWeatherForecast
                :location="weatherStore.getCity"
                :country="weatherStore.getCountry"
                :todayDate="formattedDate"
                :todayTemperature="weatherStore.temperatureDisplay"
                :temperatureUnit="weatherStore.temperatureUnit"
            />

            <div class="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <CardComponent
                    :title="'Feels like'"
                    :currentWeatherAmount="weatherStore.apparentTemperatureDisplay"
                    :weatherUnit="weatherStore.temperatureUnit"
                />

                <CardComponent
                    :title="'Humidity'"
                    :currentWeatherAmount="weatherStore.humidity"
                    :weatherUnit="'%'"
                />

                <CardComponent
                    :title="'Wind'"
                    :currentWeatherAmount="weatherStore.windSpeedDisplay"
                    :weatherUnit="weatherStore.windSpeedUnit"
                />

                <CardComponent
                    :title="'Precipitation'"
                    :currentWeatherAmount="weatherStore.precipitationDisplay"
                    :weatherUnit="weatherStore.precipitationUnit"
                />
            </div>

            <h2 class="mb-4 text-xl font-bold text-neutral-200">Daily forecast</h2>

            <!-- Daily forecast section -->
            <div class="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-7">
                <CardComponent
                    v-for="(day, index) in weatherStore.weeklyForecast"
                    :key="index"
                    :title="day.weekdayShort"
                    :image="day.icon"
                    :tempMin="day.tempMin"
                    :tempMax="day.tempMax"
                    :weatherUnit="weatherStore.temperatureUnit"
                    :fontSize="'text-sm'"
                />
            </div>
        </div>

        <!-- Hourly forecast section -->
        <div class="col-span-4">
            <div class="my-8 rounded-lg bg-neutral-800 p-3 lg:my-0">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-medium text-neutral-200">Hourly forecast</h2>
                    <HourlyForecastDropDown :options="weatherStore.hourlyForecastWeekDays" />
                </div>

                <div class="mt-4">
                    <HourlyForecastCard
                        v-for="item in next8HoursForecast"
                        :time="item.time"
                        :temperature="item.temperature"
                        :image="item.icon || ''"
                        :weatherUnit="weatherStore.temperatureUnit"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MainWeatherForecast from './MainWeatherForecast.vue';
import { useWeatherStore } from '../stores/weather-store';
import { useFormattedDate } from '../composables/useFormattedDate';
import CardComponent from './CardComponent.vue';
import HourlyForecastDropDown from './HourlyForecastDropDown.vue';
import HourlyForecastCard from './HourlyForecastCard.vue';

const weatherStore = useWeatherStore();
const { formatDate } = useFormattedDate();

const next8HoursForecast = computed(() => weatherStore.next8HoursForecast);

const formattedDate = computed(() => {
    return formatDate(weatherStore.timezone);
});
</script>
