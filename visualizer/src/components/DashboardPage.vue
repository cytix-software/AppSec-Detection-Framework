<!-- DashboardPage.vue -->
<template>
  <div class="dashboard-container">
    <h1>AppSec Detection Framework Visualiser</h1>

    <div class="main-content">
      <!-- Coverage Gap Analysis -->
      <n-card class="coverage-gap-wrapper">
        <ToolCoverageGap @tools-selected="handleToolsSelected" />
      </n-card>
      
      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Heatmap and Radar Charts in Tabs -->
        <n-card class="chart-wrapper">
          <n-tabs type="line" animated>
            <n-tab-pane name="heatmap-2021" tab="OWASP 2021 (Heatmap)">
              <HeatmapChart
                :options="heatmapOptions"
                :series="filteredHeatmapSeries2021"
              />
            </n-tab-pane>
            <n-tab-pane name="heatmap-2025" tab="OWASP 2025 (Heatmap)">
              <HeatmapChart
                :options="heatmapOptions"
                :series="filteredHeatmapSeries2025"
              />
            </n-tab-pane>
            <n-tab-pane name="radar" tab="Tool Comparison">
              <RadarChart :options="radarOptions" :series="filteredRadarSeries" />
            </n-tab-pane>
          </n-tabs>
        </n-card>

        <!-- Bar Chart -->
        <n-card title="Tool Performance (Bar)" class="chart-wrapper">
          <BarChart :options="filteredBarOptions" :series="filteredBarSeries" />
        </n-card>
      </div>

      <!-- Dataset Table -->
      <n-card title="Dataset" class="data-table-wrapper">
        <DataTable :data="filteredHydratedTests" />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
import { NCard, NTabs, NTabPane } from 'naive-ui'
import { groupBy, filter, find, some, includes, flatten, map } from 'lodash-es'
import { loadData } from './data'
import RadarChart from './RadarChart.vue'
import BarChart from './BarChart.vue'
import HeatmapChart from './HeatmapChart.vue'
import DataTable from './DataTable.vue'
import ToolCoverageGap from './ToolCoverageGap.vue'
import { computed, ref } from 'vue'

const { hydratedTests, hydratedHeatmapTests, vulnerabilities } = loadData()

// Split the combined list by year
const vulnerabilities2021 = computed(() =>
  vulnerabilities.filter(v => v.OWASP.includes('2021'))
)
const vulnerabilities2025 = computed(() =>
  vulnerabilities.filter(v => v.OWASP.includes('2025'))
)

// Technologies used for bar chart calculations
const technologies = ['php', 'nodejs']

// Selected tools state
const selectedTools = ref<string[]>([])

// Handle tools selected from ToolCoverageGap
function handleToolsSelected(tools: string[]) {
  selectedTools.value = tools
}

// Filter hydrated tests based on selected tools
const filteredHydratedTests = computed(() => {
  if (selectedTools.value.length === 0) return hydratedTests
  
  return hydratedTests.filter(test => 
    test.detections.some(detection => selectedTools.value.includes(detection.scanner))
  ).map(test => ({
    ...test,
    detections: test.detections.filter(detection => 
      selectedTools.value.includes(detection.scanner)
    )
  }))
})

// Filter hydrated heatmap tests based on selected tools
const filteredHydratedHeatmapTests = computed(() => {
  if (selectedTools.value.length === 0) return hydratedHeatmapTests
  
  return hydratedHeatmapTests.filter(test => 
    selectedTools.value.includes(test.scanner)
  )
})

// -----------------------------------------------------------------------------
// forHeatMap (Heatmap Chart Logic) - 2021
// -----------------------------------------------------------------------------
const heatmapData2021 = computed(() =>
  // Use the 2021-specific list
  vulnerabilities2021.value.flatMap(({ OWASP, CWEDetails }) => {
    const uniqueTests = filteredHydratedHeatmapTests.value
    
    const groupedByScanner = groupBy(uniqueTests, 'scanner')
    return Object.entries(groupedByScanner).map(([scanner, tests]) => {
      // For each test, count how many CWEs from this OWASP category were detected/undetected
      let detectedCount = 0
      let totalCount = 0

      tests.forEach(test => {
        // Count detected CWEs that belong to this OWASP category
        const detectedInCategory = test.detectedCWEs.filter(cwe => 
          CWEDetails.some(detail => detail.id === cwe)
        )
        detectedCount += detectedInCategory.length

        // Count total CWEs that belong to this OWASP category
        const totalInCategory = [
          ...test.detectedCWEs,
          ...(test.undetectedCWEs || [])
        ].filter(cwe => CWEDetails.some(detail => detail.id === cwe))
        totalCount += totalInCategory.length
      })

      return {
        scanner,
        OWASP,
        detectedCWEs: detectedCount,
        totalCount
      }
    })
  })
)

const heatmapSeries2021 = computed(() => {
  const scanners = [...new Set(hydratedHeatmapTests.map((t) => t.scanner))]

  return scanners.map((scanner) => {
    // Use the 2021-specific list
    const data = vulnerabilities2021.value.map(({ OWASP }) => {
      // Use the 2021-specific data
      const entry = find(heatmapData2021.value, { scanner, OWASP })

      // If no test coverage at all, treat as "No Data"
      const isNoData = !entry || entry.totalCount === 0
      const percentage = isNoData ? 0 : Math.round((entry.detectedCWEs / entry.totalCount) * 100)
      const labelColor = isNoData || percentage <= 25 ? '#000' : '#fff'

      return {
        x: OWASP,
        y: percentage,
        isNoData,
        dataLabels: {
          enabled: true,
          style: {
            colors: [labelColor],
          },
        },
      }
    })

    return { name: scanner, data }
  })
})

const filteredHeatmapSeries2021 = computed(() => {
  if (selectedTools.value.length === 0) return heatmapSeries2021.value
  
  return heatmapSeries2021.value.filter(series => 
    selectedTools.value.includes(series.name)
  )
})

// -----------------------------------------------------------------------------
// forHeatMap (Heatmap Chart Logic) - 2025
// -----------------------------------------------------------------------------
const heatmapData2025 = computed(() =>
  // Use the 2025-specific list
  vulnerabilities2025.value.flatMap(({ OWASP, CWEDetails }) => {
    const uniqueTests = filteredHydratedHeatmapTests.value

    const groupedByScanner = groupBy(uniqueTests, 'scanner')
    return Object.entries(groupedByScanner).map(([scanner, tests]) => {
      let detectedCount = 0
      let totalCount = 0

      tests.forEach(test => {
        const detectedInCategory = test.detectedCWEs.filter(cwe => 
          CWEDetails.some(detail => detail.id === cwe)
        )
        detectedCount += detectedInCategory.length

        const totalInCategory = [
          ...test.detectedCWEs,
          ...(test.undetectedCWEs || [])
        ].filter(cwe => CWEDetails.some(detail => detail.id === cwe))
        totalCount += totalInCategory.length
      })

      return {
        scanner,
        OWASP,
        detectedCWEs: detectedCount,
        totalCount
      }
    })
  })
)

const heatmapSeries2025 = computed(() => {
  const scanners = [...new Set(hydratedHeatmapTests.map((t) => t.scanner))]

  return scanners.map((scanner) => {
    // Use the 2025-specific list
    const data = vulnerabilities2025.value.map(({ OWASP }) => {
      // Use the 2025-specific data
      const entry = find(heatmapData2025.value, { scanner, OWASP })

      const isNoData = !entry || entry.totalCount === 0
      const percentage = isNoData ? 0 : Math.round((entry.detectedCWEs / entry.totalCount) * 100)
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

    return { name: scanner, data }
  })
})

const filteredHeatmapSeries2025 = computed(() => {
  if (selectedTools.value.length === 0) return heatmapSeries2025.value
  
  return heatmapSeries2025.value.filter(series => 
    selectedTools.value.includes(series.name)
  )
})

// -----------------------------------------------------------------------------
// Shared Heatmap Options
// -----------------------------------------------------------------------------

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
        
        // Find the entry in the correct heatmapData (try 2021 then 2025)
        const scannerName = opts.w.config.series[opts.seriesIndex].name
        const owaspCategory = point.x
        
        let entry = find(heatmapData2021.value, { 
          scanner: scannerName, 
          OWASP: owaspCategory 
        })
        
        if (!entry) {
          entry = find(heatmapData2025.value, { 
            scanner: scannerName, 
            OWASP: owaspCategory 
          })
        }
        
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
  const grouped = groupBy(filteredHydratedHeatmapTests.value, 'scanner')

  return Object.entries(grouped).map(([scanner, tests]) => {
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
      if (!relevantTechs.length) return

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
    return { scanner, score }
  })
}

const barSeries = computed(() => [
  {
    name: 'Weighted Detection Score',
    data: calculateWeightedScores().map((d) => d.score),
  },
])

// Filtered bar series based on selected tools
const filteredBarSeries = computed(() => {
  if (selectedTools.value.length === 0) return barSeries.value
  
  const scores = calculateWeightedScores()
  const filteredScores = scores.filter(score => 
    selectedTools.value.includes(score.scanner)
  )
  
  return [{
    name: 'Weighted Detection Score',
    data: filteredScores.map((d) => d.score),
  }]
})

const barOptions = computed(() => ({
  chart: { type: 'bar' },
  xaxis: {
    categories: calculateWeightedScores().map((d) => d.scanner),
    title: { text: 'Tools' },
  },
  yaxis: {
    title: { text: 'Weighted Detection Score (%)' },
    max: 100,
  },
  colors: ['#216FED'],
}))

// Filtered bar options based on selected tools
const filteredBarOptions = computed(() => {
  if (selectedTools.value.length === 0) return barOptions.value
  
  const scores = calculateWeightedScores()
  const filteredScores = scores.filter(score => 
    selectedTools.value.includes(score.scanner)
  )
  
  return {
    ...barOptions.value,
    xaxis: {
      ...barOptions.value.xaxis,
      categories: filteredScores.map((d) => d.scanner),
    }
  }
})

// -----------------------------------------------------------------------------
// Radar Chart Logic
// -----------------------------------------------------------------------------
const radarData = computed(() => {
  const scanners = [...new Set(filteredHydratedHeatmapTests.value.map((t) => t.scanner))]
  
  return scanners.map(scanner => {
    const data = vulnerabilities.map(({ OWASP }) => {
      let entry = find(heatmapData2021.value, { scanner, OWASP })
      if (!entry) {
        entry = find(heatmapData2025.value, { scanner, OWASP })
      }
      if (!entry || entry.totalCount === 0) return 0
      return Math.round((entry.detectedCWEs / entry.totalCount) * 100)
    })

    return {
      name: scanner,
      data
    }
  })
})

const radarSeries = computed(() => radarData.value)

// Filtered radar series based on selected tools
const filteredRadarSeries = computed(() => {
  if (selectedTools.value.length === 0) return radarSeries.value
  
  return radarSeries.value.filter(series => 
    selectedTools.value.includes(series.name)
  )
})

const radarOptions = computed(() => ({
  chart: {
    type: 'radar',
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: vulnerabilities.map(v => v.OWASP)
  },
  yaxis: {
    show: false,
    min: 0,
    max: 100
  },
  plotOptions: {
    radar: {
      size: 140,
      polygons: {
        strokeColors: '#e9e9e9',
        fill: {
          colors: ['#f8f8f8', '#fff']
        }
      }
    }
  },
  colors: ['#216FED', '#93C5FD'],
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.1
  },
  markers: {
    size: 0
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val}%`
    }
  }
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

.coverage-gap-wrapper {
  width: 100%;
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

.radar-chart {
  grid-column: 1 / -1;
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .radar-chart {
    grid-column: auto;
  }
}
</style>
