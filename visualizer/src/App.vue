<template>
  <div class="app-container">
    <DashboardPage />
  </div>
</template>

<script setup lang="ts">
import DashboardPage from './components/DashboardPage.vue';
</script>

<style>
/* Global styles that need to affect child components */
.app-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Global ApexCharts tooltip styling */
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

/* Global table overrides (if needed) */
.n-data-table .n-data-table-th {
  background: #0E1E33 !important;
  color: #FFFFFF !important;
}
</style>
