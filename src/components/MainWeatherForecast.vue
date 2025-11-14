<template>
    <div class="relative">
        <img src="/src/assets/images/bg-today-small.svg" alt="image today weather" />
        <div class="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 class="block text-2xl font-bold tracking-wide capitalize">
                {{ location.toLowerCase() }}
            </h2>
            <span>{{ todayDate }}</span>
            <div class="flex items-center justify-around">
                <img src="/src/assets/images/icon-sunny.webp" alt="icon sunny" class="w-24" />
                <span class="block text-5xl font-bold"
                    >{{ todayTemperature }} {{ temperatureUnit }}</span
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
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
        type: String,
        required: true,
    },
    temperatureUnit: {
        type: String,
        required: true,
    },
});
</script>
