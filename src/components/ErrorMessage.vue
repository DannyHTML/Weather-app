<template>
    <div class="mt-10 flex w-full items-center justify-center text-center text-white">
        <div class="">
            <span class="mb-2 flex justify-center">
                <img src="../assets/images/icon-error.svg" class="w-5" alt="Error icon" />
            </span>
            <h2 class="mb-1 text-3xl font-bold md:mb-2.5">Something went wrong</h2>
            <p class="text-sm">
                We couldn't connect to the server (API error). Please try again in a few moments
            </p>
            <div class="mt-2 flex justify-center md:mt-3">
                <!-- TODO: Make retry button action -->
                <button
                    type="button"
                    class="flex items-center justify-center gap-2 rounded-md bg-neutral-700 px-2 py-1"
                    @click="weatherStore.error = false"
                >
                    <img src="../assets/images/icon-retry.svg" class="w-3" alt="Retry icon" />
                    <span class="block">Retry</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWeatherStore } from '../stores/weather-store';

const weatherStore = useWeatherStore();
</script>
