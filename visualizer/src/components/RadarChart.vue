<!-- RadarChart.vue -->
<template>
  <div ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ApexCharts from 'apexcharts'

const props = defineProps<{
  options: any
  series: any[]
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: ApexCharts | null = null

onMounted(() => {
  if (chartRef.value) {
    // Enable the toolbar with export options
    const chartOptions = {
      ...props.options,
      series: props.series,
      chart: {
        ...props.options.chart,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        }
      }
    }
    
    chart = new ApexCharts(chartRef.value, chartOptions)
    chart.render()
  }
})

watch(
  () => props.options,
  (newOptions) => {
    if (chart) {
      chart.updateOptions(newOptions)
    }
  },
  { deep: true }
)

watch(
  () => props.series,
  (newSeries) => {
    if (chart) {
      chart.updateSeries(newSeries)
    }
  },
  { deep: true }
)
</script> 