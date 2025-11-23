<template>
    <select v-model="selectedDay" class="rounded-md bg-neutral-600 px-2 py-1">
        <option v-for="option in options" :key="option" :value="option">
            {{ option }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    options: string[];
}>();

const emit = defineEmits<{
    (e: 'update:selected', value: string): void;
}>();

const selectedDay = ref('');

// Reset selectedDay to the first option whenever options change
watch(
    () => props.options,
    (newOptions) => {
        selectedDay.value = newOptions[0] || '';
    },
    { immediate: true }
);

// Emit changes to parent
watch(selectedDay, (val) => {
    emit('update:selected', val);
});
</script>
