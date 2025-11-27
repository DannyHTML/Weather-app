<template>
    <!-- TODO: I don't think this component is necessary, double check! -->
    <CardComponent
        :title="title"
        :currentWeatherAmount="currentWeatherAmount"
        :weatherUnit="weatherUnit"
    />
</template>

<script setup lang="ts">
import CardComponent from './CardComponent.vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
    currentWeatherAmount: {
        type: Number,
        required: true,
    },
    weatherUnit: {
        type: String,
        required: true,
    },
});
</script>
