<template>
    <div class="relative text-white">
        <button
            type="button"
            @click="toggleDropdown"
            @mouseover="isOpen = true"
            class="flex w-fit cursor-pointer items-center justify-between gap-2 rounded-md bg-neutral-600 px-2 py-1"
        >
            <img src="/src/assets/images/icon-units.svg" alt="icon-units" />
            <span class="block">Units</span>
            <img
                src="/src/assets/images/icon-dropdown.svg"
                alt="icon-dropdown"
                :class="['duration-150', isOpen ? 'rotate-180' : '']"
            />
        </button>

        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
        >
            <div v-if="isOpen" class="absolute right-0 mt-2 w-56" @mouseleave="isOpen = false">
                <!-- Dropdown content to be added here -->
                <div class="rounded-md bg-neutral-700 px-3 py-2">
                    <button
                        type="button"
                        @click="toggleImperial"
                        class="w-full cursor-pointer rounded-md px-2 text-left duration-150 hover:bg-neutral-600"
                    >
                        Switch to {{ isImperial ? 'Metric' : 'Imperial' }}
                    </button>

                    <DropDownSelect
                        title="Temperature"
                        :options="temperatureOptions"
                        v-model:selectedOption="selectedTemperature"
                    />
                    <DropDownSelect
                        title="Wind Speed"
                        :options="windSpeedOptions"
                        v-model:selectedOption="selectedWindSpeed"
                    />

                    <DropDownSelect
                        title="Precipitation"
                        :options="precipitationOptions"
                        v-model:selectedOption="selectedPrecipitation"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DropDownSelect from '../DropDownSelect.vue';

const temperatureOptions = ['Celsius', 'Fahrenheit'];
const windSpeedOptions = ['km/h', 'mph'];
const precipitationOptions = ['Millimeters (mm)', 'inches (in)'];

const selectedTemperature = ref('');
const selectedWindSpeed = ref('');
const selectedPrecipitation = ref('');

const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const isImperial = computed(() => {
    return (
        selectedTemperature.value === 'Fahrenheit' &&
        selectedWindSpeed.value === 'mph' &&
        selectedPrecipitation.value === 'inches (in)'
    );
});

const toggleImperial = () => (isImperial.value ? setMetricMeasurement() : setImperialMeasurement());

const setMetricMeasurement = () => {
    selectedTemperature.value = 'Celsius';
    selectedWindSpeed.value = 'km/h';
    selectedPrecipitation.value = 'Millimeters (mm)';
};

const setImperialMeasurement = () => {
    selectedTemperature.value = 'Fahrenheit';
    selectedWindSpeed.value = 'mph';
    selectedPrecipitation.value = 'inches (in)';
};

onMounted(() => {
    // Set default selections
    setMetricMeasurement();
});
</script>
