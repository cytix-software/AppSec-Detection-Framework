<template>
  <div class="tool-coverage-gap">
    <n-card title="Coverage Gap Analysis">
      <n-space vertical>
        <n-select
          v-model:value="selectedTools"
          multiple
          filterable
          placeholder="Select tools to analyze"
          :options="toolOptions"
          style="width: 100%"
        />
        
        <n-collapse v-if="coverageGaps.length > 0" class="results-section">
          <n-collapse-item title="Coverage Gaps" name="gaps">
            <n-tabs type="line" animated>
              <n-tab-pane name="cwe" tab="CWE Gaps">
                <n-list>
                  <n-list-item v-for="cwe in cweGaps" :key="cwe.id">
                    <n-thing :title="`CWE-${cwe.id}: ${cwe.name}`">
                      <template #description>
                        <div class="cwe-details">
                          <div><strong>OWASP Category:</strong> {{ cwe.owasp }}</div>
                          <div><strong>Description:</strong> {{ cwe.description }}</div>
                          
                          <div class="tool-detection-rates">
                            <strong>Detection Rate by Tool:</strong>
                            <div v-for="(rate, tool) in cwe.toolDetectionRates" :key="tool" class="tool-rate">
                              <div class="tool-name">{{ tool }}:</div>
                              <n-progress 
                                type="line" 
                                :percentage="rate.rate" 
                                :color="getProgressColor(rate.rate)"
                                :indicator-placement="'inside'"
                                :height="16"
                              >
                                {{ rate.detected }}/{{ rate.total }} ({{ rate.rate }}%)
                              </n-progress>
                            </div>
                          </div>
                        </div>
                      </template>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-tab-pane>
              
              <n-tab-pane name="owasp" tab="OWASP Category Gaps">
                <n-list>
                  <n-list-item v-for="owasp in owaspGaps" :key="owasp.code">
                    <n-thing :title="owasp.code">
                      <template #description>
                        <div class="owasp-details">
                          <div><strong>Name:</strong> {{ owasp.name }}</div>
                          <div><strong>Missing CWEs:</strong> {{ owasp.missingCwes.length }}</div>
                          
                          <div class="tool-detection-rates">
                            <strong>Detection Rate by Tool:</strong>
                            <div v-for="(rate, tool) in owasp.toolDetectionRates" :key="tool" class="tool-rate">
                              <div class="tool-name">{{ tool }}:</div>
                              <n-progress 
                                type="line" 
                                :percentage="rate.rate" 
                                :color="getProgressColor(rate.rate)"
                                :indicator-placement="'inside'"
                                :height="16"
                              >
                                {{ rate.detected }}/{{ rate.total }} ({{ rate.rate }}%)
                              </n-progress>
                            </div>
                          </div>
                        </div>
                      </template>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-tab-pane>
            </n-tabs>
          </n-collapse-item>
        </n-collapse>
        
        <div v-else-if="selectedTools.length > 0" class="no-results">
          <n-empty description="No coverage gaps found for the selected tools" />
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  NCard, 
  NSelect, 
  NSpace, 
  NDivider, 
  NTabs, 
  NTabPane, 
  NList, 
  NListItem, 
  NThing, 
  NEmpty,
  NCollapse,
  NCollapseItem,
  NProgress
} from 'naive-ui'
import { loadData, getDetailsByCwe } from './data'
import { groupBy, uniq, difference } from 'lodash-es'

const { hydratedHeatmapTests, vulnerabilities } = loadData()

// Get unique DAST tools
const dastTools = computed(() => {
  return [...new Set(hydratedHeatmapTests.map(test => test.dast))]
})

// Create options for the select component
const toolOptions = computed(() => {
  return dastTools.value.map(tool => ({
    label: tool,
    value: tool
  }))
})

// Selected tools
const selectedTools = ref<string[]>([])

// Coverage gaps results
const coverageGaps = ref<any[]>([])

// Define emits
const emit = defineEmits(['tools-selected'])

// CWE gaps
const cweGaps = computed(() => {
  if (coverageGaps.value.length === 0) return []
  
  return coverageGaps.value.map(gap => {
    const cweDetails = getDetailsByCwe(gap.cwe)
    
    // Calculate detection rates by tool for this CWE
    const toolDetectionRates = calculateToolDetectionRates(gap.cwe)
    
    return {
      id: gap.cwe,
      name: cweDetails?.title || 'Unknown',
      description: cweDetails?.group || 'No description available',
      owasp: cweDetails?.owasp || 'Unknown',
      detectionRate: gap.detectionRate,
      detectionCount: gap.detectionCount,
      totalCount: gap.totalCount,
      toolDetectionRates
    }
  }).sort((a, b) => a.id - b.id) // Sort by CWE ID
})

// OWASP category gaps
const owaspGaps = computed(() => {
  if (coverageGaps.value.length === 0) return []
  
  // Group gaps by OWASP category
  const groupedByOwasp = groupBy(coverageGaps.value, 'owasp')
  
  return Object.entries(groupedByOwasp).map(([owasp, gaps]) => {
    // Calculate detection rate for this OWASP category
    const detectionStats = calculateOwaspDetectionRate(owasp)
    
    // Calculate detection rates by tool for this OWASP category
    const toolDetectionRates = calculateOwaspToolDetectionRates(owasp)
    
    // Extract category ID (e.g., "A01:2021" -> "A01")
    const categoryId = owasp.split(':')[0]
    
    return {
      code: owasp,
      name: owasp.split(' ')[1] || owasp, // Extract name part if available
      categoryId, // Add category ID for sorting
      missingCwes: gaps.map(gap => gap.cwe),
      detectionRate: detectionStats.rate,
      detectionCount: detectionStats.detected,
      totalCount: detectionStats.total,
      toolDetectionRates
    }
  }).sort((a, b) => {
    // Sort by category ID (e.g., A01, A02, etc.)
    return a.categoryId.localeCompare(b.categoryId)
  })
})

// Calculate detection rate for an OWASP category
function calculateOwaspDetectionRate(owaspCategory: string) {
  // Get all CWEs in this OWASP category
  const cwesInCategory = vulnerabilities
    .filter(v => v.OWASP === owaspCategory)
    .flatMap(v => v.CWE)
  
  // Initialize counters
  let detected = 0
  let total = 0
  
  // Process all tests for selected tools
  selectedTools.value.forEach(tool => {
    const toolTests = hydratedHeatmapTests.filter(test => test.dast === tool)
    
    toolTests.forEach(test => {
      // Count detections for CWEs in this category
      cwesInCategory.forEach(cwe => {
        const wasDetected = test.detectedCWEs.includes(cwe)
        const wasUndetected = test.undetectedCWEs && test.undetectedCWEs.includes(cwe)
        
        if (wasDetected || wasUndetected) {
          total++
          if (wasDetected) {
            detected++
          }
        }
      })
    })
  })
  
  return {
    detected,
    total,
    rate: total > 0 ? Math.round((detected / total) * 100) : 0
  }
}

// Calculate detection rates by tool for a specific CWE
function calculateToolDetectionRates(cwe: number) {
  const toolRates: Record<string, { detected: number, total: number, rate: number }> = {}
  
  // Initialize rates for each selected tool
  selectedTools.value.forEach(tool => {
    toolRates[tool] = { detected: 0, total: 0, rate: 0 }
  })
  
  // Process all tests for selected tools
  selectedTools.value.forEach(tool => {
    const toolTests = hydratedHeatmapTests.filter(test => test.dast === tool)
    
    toolTests.forEach(test => {
      const wasDetected = test.detectedCWEs.includes(cwe)
      const wasUndetected = test.undetectedCWEs && test.undetectedCWEs.includes(cwe)
      
      if (wasDetected || wasUndetected) {
        toolRates[tool].total++
        if (wasDetected) {
          toolRates[tool].detected++
        }
      }
    })
    
    // Calculate rate for this tool
    toolRates[tool].rate = toolRates[tool].total > 0 
      ? Math.round((toolRates[tool].detected / toolRates[tool].total) * 100) 
      : 0
  })
  
  return toolRates
}

// Calculate detection rates by tool for an OWASP category
function calculateOwaspToolDetectionRates(owaspCategory: string) {
  // Get all CWEs in this OWASP category
  const cwesInCategory = vulnerabilities
    .filter(v => v.OWASP === owaspCategory)
    .flatMap(v => v.CWE)
  
  const toolRates: Record<string, { detected: number, total: number, rate: number }> = {}
  
  // Initialize rates for each selected tool
  selectedTools.value.forEach(tool => {
    toolRates[tool] = { detected: 0, total: 0, rate: 0 }
  })
  
  // Process all tests for selected tools
  selectedTools.value.forEach(tool => {
    const toolTests = hydratedHeatmapTests.filter(test => test.dast === tool)
    
    toolTests.forEach(test => {
      // Count detections for CWEs in this category
      cwesInCategory.forEach(cwe => {
        const wasDetected = test.detectedCWEs.includes(cwe)
        const wasUndetected = test.undetectedCWEs && test.undetectedCWEs.includes(cwe)
        
        if (wasDetected || wasUndetected) {
          toolRates[tool].total++
          if (wasDetected) {
            toolRates[tool].detected++
          }
        }
      })
    })
    
    // Calculate rate for this tool
    toolRates[tool].rate = toolRates[tool].total > 0 
      ? Math.round((toolRates[tool].detected / toolRates[tool].total) * 100) 
      : 0
  })
  
  return toolRates
}

// Analyze coverage gaps
function analyzeCoverageGaps() {
  if (selectedTools.value.length === 0) {
    coverageGaps.value = []
    return
  }
  
  // Emit the selected tools to the parent component
  emit('tools-selected', selectedTools.value)
  
  // Create Sets to track unique CWEs
  const allTestedCwes = new Set<number>()
  const detectedCwes = new Map<number, number>() // CWE -> count of detections
  const totalTests = new Map<number, number>() // CWE -> total tests
  
  // Process all tests for selected tools
  selectedTools.value.forEach(tool => {
    const toolTests = hydratedHeatmapTests.filter(test => test.dast === tool)
    
    toolTests.forEach(test => {
      // Process detected CWEs
      test.detectedCWEs.forEach(cwe => {
        allTestedCwes.add(cwe)
        detectedCwes.set(cwe, (detectedCwes.get(cwe) || 0) + 1)
        totalTests.set(cwe, (totalTests.get(cwe) || 0) + 1)
      })
      
      // Process undetected CWEs
      if (test.undetectedCWEs) {
        test.undetectedCWEs.forEach(cwe => {
          allTestedCwes.add(cwe)
          totalTests.set(cwe, (totalTests.get(cwe) || 0) + 1)
        })
      }
    })
  })
  
  // Find CWEs that were tested but not detected 100% of the time
  const gaps = Array.from(allTestedCwes)
    .filter(cwe => {
      const detected = detectedCwes.get(cwe) || 0
      const total = totalTests.get(cwe) || 0
      return detected < total // Include if not 100% detected
    })
    .map(cwe => {
      const vuln = vulnerabilities.find(v => v.CWE.includes(cwe))
      return {
        cwe,
        owasp: vuln?.OWASP || 'Unknown',
        detectionCount: detectedCwes.get(cwe) || 0,
        totalCount: totalTests.get(cwe) || 0,
        detectionRate: Math.round(((detectedCwes.get(cwe) || 0) / (totalTests.get(cwe) || 1)) * 100)
      }
    })
  
  // Sort by detection rate (ascending) to show worst performers first
  gaps.sort((a, b) => a.detectionRate - b.detectionRate)
  
  coverageGaps.value = gaps
}

// Get color for progress bar based on detection rate
function getProgressColor(rate: number) {
  if (rate >= 80) return '#18a058' // Green for high detection rate
  if (rate >= 50) return '#f0a020' // Yellow for medium detection rate
  return '#d03050' // Red for low detection rate
}

// Watch for changes to selectedTools and automatically analyze
watch(selectedTools, () => {
  analyzeCoverageGaps()
}, { immediate: true })
</script>

<style scoped>
.tool-coverage-gap {
  width: 100%;
}

.results-section {
  margin-top: 1rem;
}

.cwe-details, .owasp-details {
  margin-top: 0.5rem;
}

.detection-rate {
  margin-top: 0.75rem;
}

.detection-rate strong {
  display: block;
  margin-bottom: 0.25rem;
}

.no-results {
  margin-top: 1rem;
}

.tool-detection-rates {
  margin-top: 0.75rem;
}

.tool-rate {
  margin-bottom: 0.5rem;
}

.tool-name {
  margin-bottom: 0.25rem;
}
</style> 