<!-- HeatmapChart.vue -->
<template>
  <apexchart
    type="heatmap"
    width="100%"
    :options="options"
    :series="series"
  />
  <p>
    This chart shows what percentage of vulnerabilities in each of the OWASP top 10 categories have been covered by the dast scanner. When 'all technologies' is selected, a scanner is considered to cover a category if a successful detection exists for any technology.
  </p>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';

defineProps({
  options: { type: Object, required: true },
  series: { type: Array, required: true }
});

const apexchart = VueApexCharts;
</script>
