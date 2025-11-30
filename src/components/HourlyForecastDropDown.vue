<template>
    <div class="relative text-white">
        <button
            type="button"
            ref="toggleButtonRef"
            @click="toggleDropdown"
            @mouseover="handleMouseOver"
            :disabled="!weatherStore.getCity"
            @focusin="isOpen = true"
            class="flex w-fit cursor-pointer items-center justify-between gap-2 rounded-md bg-neutral-600 px-2 py-1"
        >
            <span class="block">{{ currentDay }}</span>
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
                class="absolute right-0 z-50 mt-2 w-36"
                @mouseleave="handleMouseLeave"
            >
                <!-- Dropdown content to be added here -->
                <div class="rounded-md border border-neutral-600 bg-neutral-800 px-1.5 text-center">
                    <!-- TODO: Make sure TAB also works for accessibility -->
                    <DropDownSelect
                        :options="weatherStore.hourlyForecastWeekDays"
                        v-model:selectedOption="weatherStore.selectedHourlyForecastDay"
                        :style="'pb-2.5'"
                        tabindex="-1"
                        @focusout="onFocusOut"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, useTemplateRef, computed, onBeforeMount } from 'vue';
import { onClickOutside } from '@vueuse/core';
import DropDownSelect from './DropDownSelect.vue';
import { useWeatherStore } from '../stores/weather-store';

const weatherStore = useWeatherStore();

const currentSelectedDay = ref('');
let placeholderCurrentDay = ref('');

defineProps({
    options: {
        type: Array as () => string[],
        required: false,
        default: () => [],
    },
});

const emit = defineEmits<{
    (e: 'update:selected', value: string): void;
}>();

const isOpen = ref(false);
const supportHover = ref(false);

const toggleDropdown = () => {
    if (!supportHover.value && !weatherStore.getCity) {
        isOpen.value = !isOpen.value;
    }
};

const handleMouseOver = () => {
    if (supportHover.value && weatherStore.getCity) {
        isOpen.value = true;
        console.log('hovered');
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
    () => {
        isOpen.value = false;
    },
    {
        ignore: [toggleButtonRef],
    }
);

const onFocusOut = (event: FocusEvent) => {
    const nextFocusedEl = event.relatedTarget as HTMLElement | null;

    if (
        nextFocusedEl &&
        (dropdownRef.value?.contains(nextFocusedEl) ||
            toggleButtonRef.value?.contains(nextFocusedEl))
    ) {
        return;
    }
    isOpen.value = false;
};

const currentDay = computed(() => {
    if (currentSelectedDay.value) {
        return currentSelectedDay.value;
    }
    return placeholderCurrentDay;
});

onBeforeMount(() => {
    placeholderCurrentDay.value = new Date().toLocaleDateString(navigator.language, {
        weekday: 'long',
    });
});

onMounted(() => {
    // Modern, type-safe hover detection
    supportHover.value = !('ontouchstart' in window || navigator.maxTouchPoints > 0);
    currentSelectedDay.value = weatherStore.todayWeekday;
});

watch(
    () => weatherStore.todayWeekday,
    (newDay) => {
        currentSelectedDay.value = newDay;
    }
);

watch(
    () => weatherStore.selectedHourlyForecastDay,
    (day) => {
        if (day) {
            currentSelectedDay.value = day;
            isOpen.value = false; // close dropdown on selection
        }
    }
);
</script>
