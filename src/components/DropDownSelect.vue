<template>
    <template v-if="options.length > 0">
        <div class="mt-1 not-last:border-b">
            <span class="block px-2 text-neutral-400">{{ title }}</span>

            <template v-for="option in options" :key="option">
                <button
                    class="flex w-full items-center justify-between rounded-md px-2 hover:bg-neutral-600"
                >
                    <span>{{ option }}</span>
                    <template v-if="isSelected">
                        <img src="/src/assets/images/icon-checkmark.svg" alt="checkmark" />
                    </template>
                </button>
            </template>
        </div>
    </template>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: false,
        default: () => [],
    },
    isSelected: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>
