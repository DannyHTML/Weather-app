<template>
    <div class="relative text-white">
        <div
            class="flex w-fit cursor-pointer items-center justify-between gap-2 rounded-md bg-neutral-600 px-2 py-1"
        >
            <img src="/src/assets/images/icon-units.svg" alt="" />
            <span class="block">Units</span>
            <img src="/src/assets/images/icon-dropdown.svg" alt="" />
        </div>

        <div class="absolute right-0 mt-2 w-56">
            <!-- Dropdown content to be added here -->
            <div class="rounded-md bg-neutral-700 px-3 py-2">
                <button
                    type="button"
                    class="w-full cursor-pointer rounded-md px-2 text-left hover:bg-neutral-600"
                >
                    Switch to Imperial
                </button>

                <DropDownSelect title="Temperature" :options="temperatureOptions" />

                <DropDownSelect title="Wind Speed" />

                <DropDownSelect title="Precipitation" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DropDownSelect from '../DropDownSelect.vue';

const temperatureOptions = ['Celsius', 'Fahrenheit'];
</script>
