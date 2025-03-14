<template>
  <div class="data-table-container">
    <div class="column-filters">
      <div v-for="col in columns" :key="col.key" class="filter-input">
        <!-- Standard text input for most columns -->
        <n-input
          v-if="col.key !== 'profiles' && col.key !== 'detected'"
          v-model:value="filters[col.key]"
          :placeholder="`Filter ${col.title}`"
          clearable
        />

        <!-- Boolean select for detected column -->
        <n-select
          v-if="col.key === 'detected'"
          v-model:value="filters.detected"
          :options="detectedOptions"
          placeholder="Filter Detected"
          clearable
        />

        <!-- Multi-select for profiles column -->
        <n-select
          v-if="col.key === 'profiles'"
          v-model:value="filters.profiles"
          :options="profileOptions"
          placeholder="Filter Profiles"
          multiple
          tag
          clearable
        />
      </div>
    </div>

    <n-data-table
      :columns="columns"
      :data="filteredData"
      :pagination="pagination"
      class="results-table"
    />
  </div>
</template>

<script setup lang="ts">
import { NDataTable, NInput, NSelect, NTag } from 'naive-ui'
import { computed, reactive, h } from 'vue'
import { filter as lodashFilter, includes, every, some, toLower } from 'lodash-es'
import type { HydratedTest } from './types'

const columns = computed(() => [
  { title: 'DAST Tool', key: 'dast' },
  { title: 'Test Name', key: 'test' },
  {
    title: 'Detected',
    key: 'detected',
    render: (row: HydratedTest) => (row.detectedCWEs.length > 0 ? '✅' : '❌'),
  },
  {
    title: 'Last Updated',
    key: 'updatedAt',
    render: (row: HydratedTest) => new Date(row.updatedAt * 1000).toLocaleDateString(),
  },
  {
    title: 'Profiles',
    key: 'profiles',
    width: 200, // limit the column width
    render: (row: HydratedTest) =>
      h(
        'div',
        { class: 'profiles-cell' },
        row.profiles.map((p) => h(NTag, { type: 'info' }, { default: () => p })),
      ),
  },
])

const props = defineProps({
  data: { type: Array as () => HydratedTest[], required: true },
  pagination: { type: Object, required: true },
})

interface FilterState {
  dast: string
  test: string
  detected: boolean | null
  updatedAt: string
  profiles: string[]
}

// Define filter state for each column
const filters = reactive<FilterState>({
  dast: '',
  test: '',
  detected: null,
  updatedAt: '',
  profiles: [],
})

// Generate profile options from unique values in data
const profileOptions = computed(() => {
  const allProfiles = props.data.flatMap((test) => test.profiles)
  return [...new Set(allProfiles)].map((profile) => ({
    label: profile,
    value: profile,
  }))
})

// Boolean options for detected column
const detectedOptions = [
  { label: 'Detected ✅', value: true },
  { label: 'Not Detected ❌', value: false },
]

const filteredData = computed(() => {
  return lodashFilter(props.data, (row) => {
    return every([
      // DAST Tool filter
      !filters.dast || includes(toLower(row.dast), toLower(filters.dast)),

      // Test Name filter
      !filters.test || includes(toLower(row.test), toLower(filters.test)),

      // Detected filter
      filters.detected === null || !!row.detectedCWEs === filters.detected,

      // Last Updated filter (matches date string)
      !filters.updatedAt ||
        includes(new Date(row.updatedAt * 1000).toLocaleDateString(), filters.updatedAt),

      // Profiles filter (must include all selected)
      filters.profiles.length === 0 ||
        every(filters.profiles, (profile) => includes(row.profiles, profile)),
    ])
  })
})
</script>

<style scoped>
.n-tag {
  margin: 0.5rem;
}

.data-table-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.column-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-input {
  min-width: 200px;
}

.results-table :deep(.n-data-table-th) {
  background: #0e1e33 !important;
  color: #ffffff !important;
  font-size: 12px !important;
}

.results-table :deep(.n-tag) {
  background: #216fed !important;
  color: #ffffff !important;
  border-radius: 20px !important;
  margin: 0.2rem;
}

/* Style the multi-select tags */
.results-table :deep(.n-base-selection-tag__content) {
  background: #1a4d8f !important;
}
</style>
