<template>
  <div class="app-container">
    <NConfigProvider>
      <DashboardPage />
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import DashboardPage from './components/DashboardPage.vue'
import { NConfigProvider } from 'naive-ui'
</script>

<style>
/* Global styles that need to affect child components */
.app-container {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Global ApexCharts tooltip styling */
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
  font-weight: 600 !important;
  padding: 12px !important;
}

.apexcharts-tooltip-series-group {
  background: #ffffff !important;
  padding: 8px 12px !important;
}

.apexcharts-tooltip-marker {
  background: #216fed !important;
}

/* Global table overrides (if needed) */
.n-data-table .n-data-table-th {
  background: #0e1e33 !important;
  color: #ffffff !important;
}
</style>
