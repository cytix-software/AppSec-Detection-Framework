<template>
  <div class="dashboard-container">
    <h1>AppSec Detection Framework Visualizer</h1>

    <div class="main-content">
      <div class="chart-wrapper">
        <div class="chart-controls">
          <n-select
            v-model:value="selectedChart"
            :options="chartTypes"
            placeholder="Select Chart Type"
            class="chart-select"
          />
          <n-select
            v-if="selectedChart === 'heatmap'"
            v-model:value="selectedTechnology"
            :options="technologyOptions"
            placeholder="Select Technology"
            class="chart-select"
            clearable
          />
        </div>

        <div v-if="selectedChart === 'bar'">
          <apexchart
            type="bar"
            width="100%"
            :options="barOptions"
            :series="barSeries"
          />
          <p>
            This chart shows a detection score percentage that indicates how effective a DAST scanner is at identifying vulnerabilities overall. This score is adjusted to account for tests done for the same vulnerability across multiple tech stacks.
          </p>
        </div>

        <apexchart
          v-else-if="selectedChart === 'heatmap'"
          type="heatmap"
          width="100%"
          :options="heatmapOptions"
          :series="heatmapSeries"
        />
      </div>

      <div class="data-table-wrapper">
        <n-data-table
          :columns="columns"
          :data="filteredTests"
          :pagination="pagination"
          class="results-table"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { NDataTable, NSelect, NTag } from 'naive-ui';
import VueApexCharts from 'vue3-apexcharts';
import { groupBy, filter, find, every, some, includes } from 'lodash-es';
import { loadData } from './data';
import type { HydratedTest } from './types';

const apexchart = VueApexCharts;

// Chart type definitions
const chartTypes = [
  { label: 'DAST Performance (Bar)', value: 'bar' },
  { label: 'OWASP Coverage (Heatmap)', value: 'heatmap' }
];

// Data loading
const { hydratedTests, vulnerabilities } = loadData();

// Reactive state
const selectedChart = ref('bar');
const selectedTechnology = ref<string | null>(null);

// Technologies and options
const technologies = ['php', 'nodejs'];
const technologyOptions = computed(() => [
  { label: 'All Technologies', value: null },
  ...technologies.map(tech => ({ label: tech.toUpperCase(), value: tech }))
]);

// Computed properties
const filteredTests = computed(() => {
  if (!selectedTechnology.value) return hydratedTests;
  return filter(hydratedTests, test =>
    includes(test.profiles, selectedTechnology.value)
  );
});

const heatmapData = computed(() => {
  return vulnerabilities.flatMap(({ OWASP, CWE }) => {
    const cweTests = CWE.flatMap(cwe =>
      filter(hydratedTests, test =>
        some(test.profiles, p => p === `cwe-${cwe}`) &&
        (!selectedTechnology.value || includes(test.profiles, selectedTechnology.value))
    ));

    const groupedByDast = groupBy(cweTests, 'dast');

    return Object.entries(groupedByDast).map(([dast, tests]) => ({
      dast,
      OWASP,
      detectedCount: filter(tests, 'detected').length,
      totalCount: tests.length
    }));
  });
});

const heatmapSeries = computed(() => {
  const dasts = [...new Set(hydratedTests.map(t => t.dast))];
  return dasts.map(dast => ({
    name: dast,
    data: vulnerabilities.map(({ OWASP }) => {
      const entry = find(heatmapData.value, { dast, OWASP });
      const percentage = entry && entry.totalCount > 0
        ? Math.round((entry.detectedCount / entry.totalCount) * 100)
        : 0;
      return { x: OWASP, y: percentage };
    })
  }));
});

// Chart configurations
const barSeries = computed(() => [{
  name: 'Weighted Detection Score',
  data: calculateWeightedScores().map(d => d.score)
}]);

const barOptions = computed(() => ({
  chart: { type: 'bar' },
  xaxis: {
    categories: calculateWeightedScores().map(d => d.dast),
    title: { text: 'DAST Tools' }
  },
  yaxis: {
    title: { text: 'Weighted Detection Score (%)' },
    max: 100
  },
  colors: ['#216FED']
}));

const heatmapOptions = computed(() => ({
  chart: { type: 'heatmap' },
  dataLabels: { enabled: true, formatter: (val: number) => `${val}%` },
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
          { from: 76, to: 100, color: '#0E1E33' }
        ]
      }
    }
  }
}));

// Table configuration
const columns = [
  { title: 'DAST Tool', key: 'dast' },
  { title: 'Test Name', key: 'test' },
  {
    title: 'Detected',
    key: 'detected',
    render: (row: HydratedTest) => row.detected ? '✅' : '❌'
  },
  {
    title: 'Last Updated',
    key: 'updatedAt',
    render: (row: HydratedTest) => new Date(row.updatedAt * 1000).toLocaleDateString()
  },
  {
    title: 'Profiles',
    key: 'profiles',
    render: (row: HydratedTest) => row.profiles.map(p =>
      h(NTag, { type: 'info', class: 'mr-2' }, { default: () => p })
    )
  }
];

const pagination = { pageSize: 5 };

// Weighted score calculation using Lodash
const calculateWeightedScores = () => {
  const grouped = groupBy(hydratedTests, 'dast');

  return Object.entries(grouped).map(([dast, tests]) => {
    const techCounts = groupBy(
      tests.flatMap(t => t.profiles.filter(p => includes(technologies, p))),
      tech => tech
    );

    let totalWeight = 0;
    let detectedWeight = 0;

    tests.forEach(test => {
      const relevantTechs = test.profiles.filter(p => includes(technologies, p));
      if (relevantTechs.length === 0) return;

      const weight = relevantTechs.reduce((sum, tech) =>
        sum + (1 / (techCounts[tech]?.length || 1)), 0) / relevantTechs.length;

      totalWeight += weight;
      if (test.detected) detectedWeight += weight;
    });

    return {
      dast,
      score: totalWeight > 0 ? Number(((detectedWeight / totalWeight) * 100).toFixed(2)) : 0
    };
  });
};
</script>

<style>
/* Chart controls styling */
.chart-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.chart-select {
  min-width: 240px;
  background: #FFF2EA;
  border-radius: 6px;
}

/* Heatmap tooltip styling */
.apexcharts-tooltip {
  background: #FFFFFF !important;
  border: 2px solid #8181AC !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(2, 14, 30, 0.1) !important;
}

.apexcharts-tooltip-title {
  background: #0E1E33 !important;
  color: #FFFFFF !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 600 !important;
  padding: 12px !important;
}

.apexcharts-tooltip-series-group {
  background: #FFFFFF !important;
  padding: 8px 12px !important;
}

.apexcharts-tooltip-marker {
  background: #216FED !important;
}

/* Data table styling */
.results-table .n-data-table-th {
  background: #0E1E33 !important;
  color: #FFFFFF !important;
  font-size: 16px !important;
}

.results-table .n-tag {
  background: #216FED !important;
  color: #FFFFFF !important;
  border-radius: 20px !important;
}
</style>
