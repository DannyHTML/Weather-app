<template>
    <template v-if="options.length > 0">
        <div class="py-2 not-last:border-b">
            <span class="block px-2 text-neutral-400">{{ title }}</span>

            <template v-for="option in options" :key="option">
                <button
                    type="button"
                    :class="[
                        'flex w-full cursor-pointer items-center justify-between rounded-md px-2 duration-100 hover:bg-neutral-600',
                        selectedOption === option ? 'bg-neutral-600' : '',
                    ]"
                    @click="emit('update:selectedOption', option)"
                >
                    <span>{{ option }}</span>
                    <template v-if="selectedOption === option">
                        <img src="/src/assets/images/icon-checkmark.svg" alt="checkmark" />
                    </template>
                </button>
            </template>
        </div>
    </template>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
    title: {
        type: String,
        required: false,
        default: '',
    },
    options: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => [],
    },
    selectedOption: {
        type: String,
        required: true,
    },
});

const emit = defineEmits<{
    (event: 'update:selectedOption', option: string): void;
}>();
</script>
