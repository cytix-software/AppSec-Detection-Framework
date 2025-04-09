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
        
        <n-grid v-if="coverageGaps.length > 0" cols="3" :x-gap="12" :y-gap="8">
          <n-gi>
            <n-statistic label="Total CWEs with Detection Gaps">
              <n-number-animation
                ref="numberAnimationInstRef"
                :from="0"
                :to="coverageGaps.length"
              />
            </n-statistic>
          </n-gi>
          <n-gi>
            <n-statistic label="OWASP Categories Affected">
              <n-number-animation
                ref="numberAnimationInstRef"
                :from="0"
                :to="affectedOwaspCategories"
              />
            </n-statistic>
          </n-gi>
          <n-gi>
            <n-statistic label="Critical Gaps (0% Detection)">
              <template #prefix>
                <n-tag type="error" size="small">Critical</n-tag>
              </template>
              <n-number-animation
                ref="numberAnimationInstRef"
                :from="0"
                :to="criticalGapsCount"
              />
            </n-statistic>
          </n-gi>
        </n-grid>
        
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
                                :rail-color="rate.rate === 0 ? '#d03050' : undefined"
                                :show-indicator="true"
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
                                :rail-color="rate.rate === 0 ? '#d03050' : undefined"
                                :show-indicator="true"
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
  NProgress,
  NStatistic,
  NNumberAnimation,
  NGrid,
  NGi,
  NIcon,
  NTag
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
    const vulnerability = vulnerabilities.find(v => 
      v.CWEDetails.some(detail => detail.id === gap.cwe)
    )
    
    return {
      id: gap.cwe,
      name: cweDetails?.title || 'Unknown',
      description: vulnerability?.group || 'No description available',
      owasp: vulnerability?.OWASP || 'Unknown',
      detectionRate: gap.detectionRate,
      detectionCount: gap.detectionCount,
      totalCount: gap.totalCount,
      toolDetectionRates: gap.toolDetectionRates
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
const calculateOwaspDetectionRate = (owasp: string) => {
  const cwesInCategory = vulnerabilities
    .filter(v => v.OWASP === owasp)
    .flatMap(v => v.CWEDetails.map(detail => detail.id))
  
  let detected = 0
  let total = 0
  
  // Process tests for selected tools
  hydratedHeatmapTests.forEach(test => {
    if (selectedTools.value.includes(test.dast)) {
      const testCwes = [...test.detectedCWEs, ...test.undetectedCWEs]
      cwesInCategory.forEach(cwe => {
        if (testCwes.includes(cwe)) {
          total++
          if (test.detectedCWEs.includes(cwe)) {
            detected++
          }
        }
      })
    }
  })
  
  return {
    detected,
    total,
    rate: total > 0 ? (detected / total) * 100 : 0
  }
}

// Calculate detection rates by tool for an OWASP category
function calculateOwaspToolDetectionRates(owaspCategory: string) {
  // Get all CWEs in this OWASP category
  const cwesInCategory = vulnerabilities
    .filter(v => v.OWASP === owaspCategory)
    .flatMap(v => v.CWEDetails.map(detail => detail.id))
  
  const toolRates: Record<string, { detected: number; total: number; rate: number }> = {}
  
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
    if (toolRates[tool].total > 0) {
      toolRates[tool].rate = Math.round((toolRates[tool].detected / toolRates[tool].total) * 100)
    }
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
  
  // Track detection rates by tool for each CWE
  const toolDetectionRates = new Map<number, Record<string, { detected: number, total: number, rate: number }>>()
  
  // Process all tests for selected tools
  selectedTools.value.forEach(tool => {
    const toolTests = hydratedHeatmapTests.filter(test => test.dast === tool)
    
    toolTests.forEach(test => {
      // Process detected CWEs
      test.detectedCWEs.forEach(cwe => {
        allTestedCwes.add(cwe)
        detectedCwes.set(cwe, (detectedCwes.get(cwe) || 0) + 1)
        totalTests.set(cwe, (totalTests.get(cwe) || 0) + 1)
        
        // Initialize tool detection rates for this CWE if needed
        if (!toolDetectionRates.has(cwe)) {
          toolDetectionRates.set(cwe, {})
        }
        
        // Initialize tool detection rates for this tool if needed
        if (!toolDetectionRates.get(cwe)![tool]) {
          toolDetectionRates.get(cwe)![tool] = { detected: 0, total: 0, rate: 0 }
        }
        
        // Update tool detection rates
        toolDetectionRates.get(cwe)![tool].detected++
        toolDetectionRates.get(cwe)![tool].total++
      })
      
      // Process undetected CWEs
      if (test.undetectedCWEs) {
        test.undetectedCWEs.forEach(cwe => {
          allTestedCwes.add(cwe)
          totalTests.set(cwe, (totalTests.get(cwe) || 0) + 1)
          
          // Initialize tool detection rates for this CWE if needed
          if (!toolDetectionRates.has(cwe)) {
            toolDetectionRates.set(cwe, {})
          }
          
          // Initialize tool detection rates for this tool if needed
          if (!toolDetectionRates.get(cwe)![tool]) {
            toolDetectionRates.get(cwe)![tool] = { detected: 0, total: 0, rate: 0 }
          }
          
          // Update tool detection rates
          toolDetectionRates.get(cwe)![tool].total++
        })
      }
    })
    
    // Calculate rates for each tool
    toolDetectionRates.forEach((toolRates, cwe) => {
      if (toolRates[tool]) {
        toolRates[tool].rate = toolRates[tool].total > 0 
          ? Math.round((toolRates[tool].detected / toolRates[tool].total) * 100) 
          : 0
      }
    })
  })
  
  // Find CWEs that were tested but not detected 100% of the time by any tool
  const gaps = Array.from(allTestedCwes)
    .filter(cwe => {
      // Check if any tool has 100% detection rate for this CWE
      const hasPerfectDetection = selectedTools.value.some(tool => {
        const toolRate = toolDetectionRates.get(cwe)?.[tool]
        return toolRate && toolRate.total > 0 && toolRate.rate === 100
      })
      
      // Only include if no tool has 100% detection rate
      return !hasPerfectDetection
    })
    .map(cwe => {
      const vuln = vulnerabilities.find(v => v.CWEDetails.some(detail => detail.id === cwe))
      return {
        cwe,
        owasp: vuln?.OWASP || 'Unknown',
        detectionCount: detectedCwes.get(cwe) || 0,
        totalCount: totalTests.get(cwe) || 0,
        detectionRate: Math.round(((detectedCwes.get(cwe) || 0) / (totalTests.get(cwe) || 1)) * 100),
        toolDetectionRates: toolDetectionRates.get(cwe) || {}
      }
    })
  
  // Sort by CWE ID
  gaps.sort((a, b) => a.cwe - b.cwe)
  
  coverageGaps.value = gaps
}

// Get color for progress bar based on detection rate
function getProgressColor(rate: number) {
  if (rate === 0) return '#d03050' // Brightest red for 0% detection rate
  if (rate < 25) return '#e88080' // Light red for very low detection rate
  if (rate < 50) return '#f0a020' // Yellow for low detection rate
  if (rate < 75) return '#70c0e8' // Light blue for medium detection rate
  if (rate < 100) return '#18a058' // Green for high detection rate
  return '#2080f0' // Blue for 100% detection rate
}

// Calculate average detection rate
const averageDetectionRate = computed(() => {
  if (coverageGaps.value.length === 0) return 0
  const sum = coverageGaps.value.reduce((acc, gap) => acc + gap.detectionRate, 0)
  return Number((sum / coverageGaps.value.length).toFixed(1))
})

// Calculate number of affected OWASP categories
const affectedOwaspCategories = computed(() => {
  if (coverageGaps.value.length === 0) return 0
  return new Set(coverageGaps.value.map(gap => gap.owasp)).size
})

// Calculate number of critical gaps (0% detection rate)
const criticalGapsCount = computed(() => {
  if (coverageGaps.value.length === 0) return 0
  return coverageGaps.value.filter(gap => gap.detectionRate === 0).length
})

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