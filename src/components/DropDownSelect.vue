<template>
    <template v-if="options.length > 0">
        <div class="py-2 not-last:border-b">
            <span class="block px-2 text-neutral-400">{{ title }}</span>

            <template v-for="option in options" :key="option.value">
                <button
                    type="button"
                    :class="[
                        'my-2 flex w-full cursor-pointer items-center justify-between rounded-md px-2 duration-100 hover:bg-neutral-600',
                        selectedOption === option.value ? 'bg-neutral-600' : '',
                        style,
                    ]"
                    @click="emit('update:selectedOption', option.value)"
                >
                    <span class="block">{{ option.label }}</span>
                    <template v-if="selectedOption === option.value">
                        <img src="/src/assets/images/icon-checkmark.svg" alt="checkmark" />
                    </template>
                </button>
            </template>
        </div>
    </template>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

type Option = {
    label: string;
    value: string;
};

defineProps({
    title: {
        type: String,
        required: false,
        default: '',
    },
    options: {
        type: Array as PropType<Option[]>,
        required: true,
    },
    selectedOption: {
        type: String,
        required: true,
    },
    style: {
        type: String,
        required: false,
        default: '',
    },
});

const emit = defineEmits<{
    (event: 'update:selectedOption', option: string): void;
}>();
</script>
