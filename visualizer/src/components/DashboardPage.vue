<!-- DashboardPage.vue -->
<template>
  <div class="dashboard-container">
    <h1>AppSec Detection Framework Visualizer</h1>

    <div class="main-content">
      <n-card title="Chart View" class="chart-wrapper">
        <ChartControls
          v-model:selected-chart="selectedChart"
          v-model:selected-technology="selectedTechnology"
          :chart-types="chartTypes"
          :technology-options="technologyOptions"
        />

        <BarChart v-if="selectedChart === 'bar'" :options="barOptions" :series="barSeries" />

        <HeatmapChart
          v-else-if="selectedChart === 'heatmap'"
          :options="heatmapOptions"
          :series="heatmapSeries"
        />
      </n-card>

      <n-card title="Dataset" class="data-table-wrapper">
        <DataTable :data="hydratedTests" :pagination="pagination" />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { NCard } from 'naive-ui'
import { groupBy, filter, find, some, includes, flatten, map } from 'lodash-es'
import { loadData } from './data'
import type { HydratedTest } from './types'
import ChartControls from './ChartControls.vue'
import BarChart from './BarChart.vue'
import HeatmapChart from './HeatmapChart.vue'
import DataTable from './DataTable.vue'

const chartTypes = [
  { label: 'DAST Performance (Bar)', value: 'bar' },
  { label: 'OWASP Coverage (Heatmap)', value: 'heatmap' },
]

const { hydratedTests, vulnerabilities } = loadData()
const selectedChart = ref('bar')
const selectedTechnology = ref<string | null>(null)
const technologies = ['php', 'nodejs']

const technologyOptions = computed(() => [
  { label: 'All Technologies', value: null },
  ...technologies.map((tech) => ({ label: tech.toUpperCase(), value: tech })),
])

const filteredTests = computed(() =>
  selectedTechnology.value
    ? filter(hydratedTests, (t) => includes(t.profiles, selectedTechnology.value))
    : hydratedTests,
)

// Heatmap calculations
const heatmapData = computed(() =>
  vulnerabilities.flatMap(({ OWASP, CWE }) => {
    const cweTests = CWE.flatMap((cwe) =>
      filter(
        hydratedTests,
        (t) =>
          some(t.profiles, (p) => p === `cwe-${cwe}`) &&
          (!selectedTechnology.value || includes(t.profiles, selectedTechnology.value)),
      ),
    )
    const groupedByDast = groupBy(cweTests, 'dast')
    return Object.entries(groupedByDast).map(([dast, tests]) => {
      const detectedCWEs = flatten(map(tests, 'detectedCWEs')).length
      const undetectedCWEs = flatten(map(tests, 'undetectedCWEs')).length
      const totalCount = detectedCWEs + undetectedCWEs
      return {
        dast,
        OWASP,
        detectedCWEs,
        totalCount,
      }
    })
  }),
)

const heatmapSeries = computed(() => {
  const dasts = [...new Set(hydratedTests.map((t) => t.dast))]
  return dasts.map((dast) => ({
    name: dast,
    data: vulnerabilities.map(({ OWASP }) => {
      const entry = find(heatmapData.value, { dast, OWASP })
      return { x: OWASP, y: entry ? Math.round((entry.detectedCWEs / entry.totalCount) * 100) : 0 }
    }),
  }))
})

// Bar chart calculations
const calculateWeightedScores = () => {
  const grouped = groupBy(hydratedTests, 'dast')
  return Object.entries(grouped).map(([dast, tests]) => {
    const techCounts = groupBy(
      tests.flatMap((t) => t.profiles.filter((p) => includes(technologies, p))),
      (tech) => tech,
    )
    let [totalWeight, detectedWeight] = [0, 0]

    tests.forEach((test) => {
      const relevantTechs = test.profiles.filter((p) => includes(technologies, p))
      if (!relevantTechs.length) return

      const weight =
        relevantTechs.reduce((sum, tech) => sum + 1 / (techCounts[tech]?.length || 1), 0) /
        relevantTechs.length

      totalWeight += weight
      //we should calculate this depending on the number of CWEs identified
      //we may want to also validate whether the CWEs are actually part of the test or if additional CWEs were identified (false positive detection)
      const weightContribution =
        (weight / (test.detectedCWEs.length + test.undetectedCWEs.length)) *
        test.detectedCWEs.length
      detectedWeight += weightContribution
    })

    return {
      dast,
      score: totalWeight ? Number(((detectedWeight / totalWeight) * 100).toFixed(2)) : 0,
    }
  })
}

const barSeries = computed(() => [
  {
    name: 'Weighted Detection Score',
    data: calculateWeightedScores().map((d) => d.score),
  },
])

const barOptions = computed(() => ({
  chart: { type: 'bar' },
  xaxis: {
    categories: calculateWeightedScores().map((d) => d.dast),
    title: { text: 'DAST Tools' },
  },
  yaxis: {
    title: { text: 'Weighted Detection Score (%)' },
    max: 100,
  },
  colors: ['#216FED'],
}))

const heatmapOptions = computed(() => ({
  chart: { type: 'heatmap' },
  dataLabels: { enabled: true, formatter: (val: number) => (val === 0 ? 'No Data' : `${val}%`) },
  colors: ['#216FED'],
  xaxis: { type: 'category' },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          { from: 0, to: 0, color: '#E5E7EB' },
          { from: 1, to: 25, color: '#93C5FD' },
          { from: 26, to: 50, color: '#216FED' },
          { from: 51, to: 75, color: '#1A4D8F' },
          { from: 76, to: 100, color: '#0E1E33' },
        ],
      },
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) => (val === 0 ? 'No Data' : `${val}%`),
    },
  },
}))

const pagination = { pageSize: 5 }
</script>

<style>
.dashboard-container {
  padding: 2rem;
  margin: 0 auto;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.apexcharts-tooltip {
  background: #ffffff !important;
  border: 2px solid #8181ac !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(2, 14, 30, 0.1) !important;
}

.apexcharts-tooltip-title {
  background: #0e1e33 !important;
  color: #ffffff !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  padding: 12px !important;
}

.apexcharts-tooltip-series-group {
  padding: 8px 12px !important;
}
</style>
