<!-- ChartControls.vue -->
<template>
  <div class="chart-controls">
    <n-select
      :value="selectedChart"
      @update:value="$emit('update:selectedChart', $event)"
      :options="chartTypes"
      placeholder="Select Chart Type"
      class="chart-select"
    />
    <n-select
      v-if="selectedChart === 'heatmap'"
      :value="selectedTechnology"
      @update:value="$emit('update:selectedTechnology', $event)"
      :options="technologyOptions"
      placeholder="Select Technology"
      class="chart-select"
      clearable
    />
  </div>
</template>

<script setup lang="ts">
import { NSelect } from 'naive-ui';

defineProps({
  selectedChart: { type: String, required: true },
  selectedTechnology: { type: String },
  chartTypes: { type: Array, required: true },
  technologyOptions: { type: Array, required: true }
});

defineEmits(['update:selectedChart', 'update:selectedTechnology']);
</script>

<style scoped>
.chart-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.chart-select {
  min-width: 240px;
  background: #FFF2EA;
  border-radius: 6px;
}
</style>
