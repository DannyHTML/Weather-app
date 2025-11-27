<template>
    <div class="rounded-lg bg-neutral-800 p-2 text-sm">
        <span :class="['block', image ? 'text-center' : 'mb-5']"> {{ title }} </span>
        <template v-if="image">
            <div class="my-2 flex justify-center">
                <img :src="image" alt="weather icon" class="w-14" />
            </div>
        </template>

        <div :class="fontSize">
            <template v-if="currentWeatherAmount !== null">
                <div class="flex items-center justify-between">
                    <span>{{ currentWeatherAmount.toFixed(1) }} {{ weatherUnit }}</span>
                </div>
            </template>
            <template v-else>
                <div class="flex w-full items-center justify-between">
                    <span class="block">{{ tempMin?.toFixed(1) }} {{ weatherUnit }}</span>
                    <span class="block">{{ tempMax?.toFixed(1) }} {{ weatherUnit }}</span>
                </div>
            </template>
            <!-- <span> weather info </span> -->
        </div>
    </div>
</template>

<script setup lang="ts">
// TODO: Create prop to give how much grid columns are needed, text placement, icon shown, font size, etc.

defineProps({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: [String, null],
        required: false,
    },
    currentWeatherAmount: {
        type: Number,
        required: false,
        default: null,
    },
    weatherUnit: {
        type: String,
        required: true,
    },
    tempMax: {
        type: Number,
        required: false,
    },
    tempMin: {
        type: Number,
        required: false,
    },
    fontSize: {
        type: String,
        required: false,
        default: 'text-base',
    },
});
</script>
