<!-- BarChart.vue -->
<template>
  <div class="bar-chart">
    <apexchart
      type="bar"
      width="100%"
      :options="options"
      :series="series"
    />
    <p class="chart-description">
      This chart shows a detection score percentage that indicates how effective a scanner is at identifying vulnerabilities overall. This score is adjusted to account for tests done for the same vulnerability across multiple tech stacks.
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

defineComponent({
  components: {
    apexchart: VueApexCharts
  }
})

defineProps({
  options: { type: Object, required: true },
  series: { type: Array, required: true }
})
</script>

<style scoped>
.chart-description {
  margin-top: 1rem;
  color: #666;
  line-height: 1.6;
}
</style>
