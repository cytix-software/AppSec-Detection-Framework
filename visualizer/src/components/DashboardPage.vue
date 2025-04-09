<!-- DashboardPage.vue -->
<template>
  <div class="dashboard-container">
    <h1>AppSec Detection Framework Visualizer</h1>

    <div class="main-content">
      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Heatmap Chart -->
        <n-card title="OWASP Coverage (Heatmap)" class="chart-wrapper">
          <HeatmapChart
            :options="heatmapOptions"
            :series="heatmapSeries"
          />
        </n-card>

        <!-- Bar Chart -->
        <n-card title="DAST Performance (Bar)" class="chart-wrapper">
          <BarChart :options="barOptions" :series="barSeries" />
        </n-card>
      </div>

      <!-- Dataset Table -->
      <n-card title="Dataset" class="data-table-wrapper">
        <DataTable :data="hydratedTests" />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
import { NCard } from 'naive-ui'
import { groupBy, filter, find, some, includes, flatten, map } from 'lodash-es'
import { loadData } from './data'

const { hydratedTests, hydratedHeatmapTests, vulnerabilities } = loadData()

// Technologies used for bar chart calculations
const technologies = ['php', 'nodejs']

// -----------------------------------------------------------------------------
// forHeatMap (Heatmap Chart Logic)
// -----------------------------------------------------------------------------
const heatmapData = computed(() =>
  vulnerabilities.flatMap(({ OWASP, CWE }) => {
    // First, find all unique tests that match any CWE in this OWASP category
    const uniqueTests = filter(
      hydratedHeatmapTests,
      (t) => some(t.profiles, (p) => CWE.includes(parseInt(p.replace('cwe-', ''))))
    )

    const groupedByDast = groupBy(uniqueTests, 'dast')
    return Object.entries(groupedByDast).map(([dast, tests]) => {
      // For each test, count how many CWEs from this OWASP category were detected/undetected
      let detectedCount = 0
      let totalCount = 0

      tests.forEach(test => {
        // Count detected CWEs that belong to this OWASP category
        const detectedInCategory = test.detectedCWEs.filter(cwe => CWE.includes(cwe))
        detectedCount += detectedInCategory.length

        // Count total CWEs that belong to this OWASP category
        const totalInCategory = [
          ...test.detectedCWEs,
          ...(test.undetectedCWEs || [])
        ].filter(cwe => CWE.includes(cwe))
        totalCount += totalInCategory.length
      })

      return {
        dast,
        OWASP,
        detectedCWEs: detectedCount,
        totalCount
      }
    })
  })
)

// Example snippet inside heatmapSeries computed
const heatmapSeries = computed(() => {
  const dasts = [...new Set(hydratedHeatmapTests.map((t) => t.dast))]

  return dasts.map((dast) => {
    const data = vulnerabilities.map(({ OWASP }) => {
      // Suppose you've computed "heatmapData" with detectedCWEs / totalCount
      const entry = find(heatmapData.value, { dast, OWASP })

      // If no test coverage at all, treat as "No Data"
      const isNoData = !entry || entry.totalCount === 0
      const percentage = isNoData ? 0 : Math.round((entry.detectedCWEs / entry.totalCount) * 100)

      // Decide label color
      // - "No Data" or ≤25% => black
      // - else => white
      const labelColor = isNoData || percentage <= 25 ? '#000' : '#fff'

      return {
        x: OWASP,
        y: percentage,
        isNoData,
        // Per data point override for text styling
        dataLabels: {
          enabled: true,
          style: {
            colors: [labelColor],
          },
        },
      }
    })

    return { name: dast, data }
  })
})

const heatmapOptions = computed(() => ({
  chart: { type: 'heatmap' },
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

  // 1) Data labels in each cell
  dataLabels: {
    enabled: true,
    formatter(val: number, opts: any) {
      // Access the data object
      const point = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
      return point.isNoData ? 'No Data' : `${val}%`
    },
  },

  // 2) Tooltip
  tooltip: {
    y: {
      formatter(val: number, opts: any) {
        const point = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
        if (point.isNoData) return 'No Data'
        
        // Find the entry in heatmapData to get the actual counts
        const entry = find(heatmapData.value, { 
          dast: opts.w.config.series[opts.seriesIndex].name, 
          OWASP: point.x 
        })
        
        if (entry) {
          return `${entry.detectedCWEs}/${entry.totalCount} (${val}%)`
        }
        
        return `${val}%`
      },
    },
  },
}))

// -----------------------------------------------------------------------------
// forPerformance (Bar Chart Logic)
// -----------------------------------------------------------------------------
function calculateWeightedScores() {
  const grouped = groupBy(hydratedHeatmapTests, 'dast')

  return Object.entries(grouped).map(([dast, tests]) => {
    // group all technologies for these tests
    const techCounts = groupBy(
      tests.flatMap((t) => t.profiles.filter((p) => includes(technologies, p))),
      (tech) => tech,
    )

    let totalWeight = 0
    let detectedWeight = 0

    tests.forEach((test) => {
      // relevant techs for each test
      const relevantTechs = test.profiles.filter((p) => includes(technologies, p))
      if (!relevantTechs.length) return // skip if no relevant technologies

      // weighting for these techs
      const weight =
        relevantTechs.reduce((sum, tech) => sum + 1 / (techCounts[tech]?.length || 1), 0) /
        relevantTechs.length

      totalWeight += weight

      // avoid dividing by zero
      const cweCount = (test.detectedCWEs?.length || 0) + (test.undetectedCWEs?.length || 0)
      if (cweCount > 0) {
        const weightContribution = (weight / cweCount) * test.detectedCWEs.length
        detectedWeight += weightContribution
      }
    })

    const score = totalWeight ? Number(((detectedWeight / totalWeight) * 100).toFixed(2)) : 0
    return { dast, score }
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
</script>

<style>
.dashboard-container {
  padding: 1rem;
  margin: 0 auto;
  max-width: 100%;
  overflow-x: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.chart-wrapper {
  overflow: hidden;
}

.data-table-wrapper {
  overflow-x: auto;
}

/* Example apexcharts custom styling */
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

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
