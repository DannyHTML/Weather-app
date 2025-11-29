<template>
    <div class="relative text-white">
        <button
            type="button"
            ref="toggleButtonRef"
            @click="toggleDropdown"
            @mouseover="handleMouseOver"
            @focusin="isOpen = true"
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
            <div
                v-if="isOpen"
                ref="dropdownRef"
                class="absolute right-0 z-50 mt-2 w-56"
                @mouseleave="handleMouseLeave"
                @focusout="handleFocusOut"
                tabindex="-1"
            >
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

<!-- TODO: Gotta work on individual unit watchers -->
<script setup lang="ts">
import { ref, onMounted, computed, watch, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import DropDownSelect from '../DropDownSelect.vue';
import { useWeatherStore } from '../../stores/weather-store';

const weatherStore = useWeatherStore();

// TODO: Logic to pinia store for measurement units

const temperatureOptions = ['Celsius', 'Fahrenheit'];
const windSpeedOptions = ['km/h', 'mph'];
const precipitationOptions = ['Millimeters (mm)', 'inches (in)'];

const selectedTemperature = ref(weatherStore.unitSystem === 'metric' ? 'Celsius' : 'Fahrenheit');
const selectedWindSpeed = ref(weatherStore.unitSystem === 'metric' ? 'km/h' : 'mph');
const selectedPrecipitation = ref(
    weatherStore.unitSystem === 'metric' ? 'Millimeters (mm)' : 'inches (in)'
);

const isOpen = ref(false);
const supportHover = ref(false);

const toggleDropdown = () => {
    if (!supportHover.value) {
        isOpen.value = !isOpen.value;
    }
};

const handleMouseOver = () => {
    if (supportHover.value) {
        isOpen.value = true;
    }
};

const handleMouseLeave = () => {
    if (supportHover.value) {
        isOpen.value = false;
    }
};

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef');
const toggleButtonRef = useTemplateRef<HTMLElement>('toggleButtonRef');

onClickOutside(
    dropdownRef,
    (event) => {
        const nextFocusedEl = event.relatedTarget as HTMLElement | null;

        if (
            nextFocusedEl &&
            (dropdownRef.value?.contains(nextFocusedEl) ||
                toggleButtonRef.value?.contains(nextFocusedEl))
        ) {
            return;
        }
        isOpen.value = false;
    },
    {
        ignore: [toggleButtonRef],
    }
);

const handleFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as HTMLElement | null;

    // If focus remains inside dropdown or button → keep open
    if (next && (dropdownRef.value?.contains(next) || toggleButtonRef.value?.contains(next))) {
        return;
    }

    // Otherwise close
    isOpen.value = false;
};

const isImperial = computed(() => {
    return (
        selectedTemperature.value === 'Fahrenheit' &&
        selectedWindSpeed.value === 'mph' &&
        selectedPrecipitation.value === 'inches (in)'
    );
});

const toggleImperial = () => {
    if (weatherStore.unitSystem === 'metric') {
        setImperialMeasurement();
        weatherStore.unitSystem = 'imperial';
    } else {
        setMetricMeasurement();
        weatherStore.unitSystem = 'metric';
    }
};

const setMetricMeasurement = () => {
    selectedTemperature.value = 'Celsius';
    selectedWindSpeed.value = 'km/h';
    selectedPrecipitation.value = 'Millimeters (mm)';
    weatherStore.unitSystem = 'metric'; // update store
};

const setImperialMeasurement = () => {
    selectedTemperature.value = 'Fahrenheit';
    selectedWindSpeed.value = 'mph';
    selectedPrecipitation.value = 'inches (in)';
    weatherStore.unitSystem = 'imperial'; // update store
};

onMounted(() => {
    // Set default selections
    setMetricMeasurement();

    // Modern, type-safe hover detection
    supportHover.value = !('ontouchstart' in window || navigator.maxTouchPoints > 0);
});

watch(
    () => weatherStore.unitSystem,
    (newUnit) => {
        if (newUnit === 'metric') setMetricMeasurement();
        else setImperialMeasurement();
    }
);
// TODO: Gotta work on individual unit watchers

// Watch local dropdown refs and update store
watch(selectedTemperature, (newVal) => {
    if (newVal === 'Celsius') weatherStore.unitSystem = 'metric';
    else if (newVal === 'Fahrenheit') weatherStore.unitSystem = 'imperial';
});

watch(selectedWindSpeed, (newVal) => {
    if (newVal === 'km/h') weatherStore.unitSystem = 'metric';
    else if (newVal === 'mph') weatherStore.unitSystem = 'imperial';
});

watch(selectedPrecipitation, (newVal) => {
    if (newVal.includes('Millimeters')) weatherStore.unitSystem = 'metric';
    else if (newVal.includes('inches')) weatherStore.unitSystem = 'imperial';
});
</script>
