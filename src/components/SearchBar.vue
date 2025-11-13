<template>
    <div class="text-white">
        <div class="my-3 text-white">
            <h1 class="px-2 text-center text-5xl font-bold">How's the sky looking today?</h1>
        </div>
        <div class="mt-10 flex flex-col gap-2">
            <span class="relative">
                <input
                    type="text"
                    placeholder="Search for a place..."
                    @keyup.enter="weatherStore.fetchWeather(getCity)"
                    v-model="getCity"
                    class="relative w-full rounded-md bg-neutral-700 py-2.5 pr-5 pl-10 placeholder:text-neutral-200 focus:outline-none"
                />
                <img
                    src="/src/assets/images/icon-search.svg"
                    alt="search-icon"
                    class="absolute top-1/2 left-0 ml-3 w-4.5 -translate-y-1/2"
                />
            </span>
            <button type="button" class="w-full rounded-md bg-blue-500 p-2.5">Search</button>
        </div>
        <div>Temperature: {{ weatherStore.currentWeatherTemp }}</div>
        <div>
            {{ getCity }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWeatherStore } from '../stores/weather-store';

const getCity = ref('');

const weatherStore = useWeatherStore();
</script>
