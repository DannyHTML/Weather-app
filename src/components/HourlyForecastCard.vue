<template>
    <div
        class="flex justify-between rounded-md border border-neutral-600 bg-neutral-700 px-1.5 py-0.5 not-last:mb-3"
    >
        <div class="flex items-center gap-2">
            <img :src="image" alt="Hourly forecast icon" class="w-12" />
            <span>{{
                new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }}</span>
        </div>
        <span class="flex items-center">{{ temperature }} {{ weatherUnit }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps({
    image: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    weatherUnit: {
        type: String,
        required: true,
    },
});
</script>
