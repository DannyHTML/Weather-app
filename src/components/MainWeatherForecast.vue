<template>
    <div class="flex w-full items-center justify-center">
        <template v-if="weatherStore.error">
            <div class="flex h-[286px] w-[343px] items-center justify-center">
                <span class="text-center">
                    ERROR: City not found, check for typos or try another city.
                </span>
            </div>
        </template>
        <template v-else>
            <div class="relative">
                <picture>
                    <source :srcset="desktopImage" media="(min-width: 768px)" />
                    <img :src="mobileImage" alt="background-today" class="w-full" />
                </picture>
                <div
                    class="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center"
                >
                    <h2 class="block w-full text-2xl font-bold tracking-wide capitalize">
                        {{ location.toLowerCase() }}, {{ country }}
                    </h2>
                    <span>{{ todayDate }}</span>
                    <div class="flex items-center justify-center gap-3">
                        <img
                            src="/src/assets/images/icon-sunny.webp"
                            alt="icon sunny"
                            class="w-24"
                        />
                        <span class="block text-5xl font-bold"
                            >{{ todayTemperature }} {{ temperatureUnit }}
                            {{ weatherStore.currentWeatherUnitFahrenheit }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import mobileBackground from '/src/assets/images/bg-today-small.svg';
import desktopBackground from '/src/assets/images/bg-today-large.svg';
import { useWeatherStore } from '../stores/weather-store';

const weatherStore = useWeatherStore();

const mobileImage = mobileBackground;
const desktopImage = desktopBackground;

defineProps({
    location: {
        type: String,
        required: true,
    },
    todayDate: {
        type: String,
        required: true,
    },
    todayTemperature: {
        type: Number,
        required: true,
    },
    temperatureUnit: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});
</script>
