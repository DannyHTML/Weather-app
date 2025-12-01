<template>
    <div class="flex w-full items-center justify-center">
        <template v-if="weatherStore.error">
            <div class="flex h-[286px] w-[343px] items-center justify-center">
                <span class="text-center">
                    ERROR: City not found, check for typos or try another city.
                </span>
            </div>
        </template>
        <!-- TODO: It works but when you select a city for the first time it looks glitchy, fix this! -->
        <template v-if="!weatherStore.getCity">
            <div
                class="relative h-[286px] w-[343px] overflow-hidden rounded-2xl bg-neutral-800 md:h-[263px] md:w-[736px]"
            >
                <!-- Content placeholders -->
                <div
                    class="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 animate-pulse flex-col items-center gap-3 text-center"
                >
                    <!-- City + Country -->
                    <div class="h-8 w-64 rounded bg-neutral-700"></div>
                    <!-- Date -->
                    <div class="h-6 w-32 rounded bg-neutral-700"></div>
                    <div class="flex items-center justify-center gap-3">
                        <!-- Temperature and Weather icon -->
                        <div class="mt-2 h-24 w-24 rounded-full bg-neutral-700"></div>
                        <div class="mt-1 h-12 w-32 rounded bg-neutral-700"></div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="relative h-[286px] w-[343px] md:h-[263px] md:w-[736px]">
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
                        <img :src="weatherStore.todayIcon" alt="icon weather today" class="w-24" />
                        <span class="block text-5xl font-bold"
                            >{{ todayTemperature.toFixed(1) }} {{ temperatureUnit }}
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
