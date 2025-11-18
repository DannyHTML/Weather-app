<template>
    <div class="rounded-lg bg-neutral-800 p-2 text-sm">
        <span :class="['block', image ? 'text-center' : 'mb-5']"> {{ title }} </span>
        <template v-if="image">
            <span class="flex justify-center">
                <img :src="image" alt="" class="w-12" />
            </span>
        </template>

        <span>{{ currentWeatherAmount }} {{ weatherUnit }}</span>

        <!-- <span> weather info </span> -->
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
        type: String,
        required: false,
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
