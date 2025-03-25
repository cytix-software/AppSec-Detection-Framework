import type { DockerCompose, VulnerabilitiesData, HydratedTest, HydratedHeatmapTest } from './types'

const dockerCompose: DockerCompose = (await import('../../../docker-compose.yml')).default
const dataJson: VulnerabilitiesData = (await import('../../../data.json')).default
const cweDataJson = (await import('../../../cweData.json')).default

export const loadData = () => {
  const hydratedHeatmapTests: HydratedHeatmapTest[] = dataJson.recordedTests.map((test) => ({
    ...test,
    profiles: dockerCompose.services[test.test]?.profiles || [],
  }))

  const testMap = new Map<string, any>()

  dataJson.vulnerabilities.forEach((vul) => {
    vul.CWE.forEach((cwe) => {
      dataJson.recordedTests.forEach((rt) => {
        if (rt.detectedCWEs.includes(cwe) || rt.undetectedCWEs?.includes(cwe)) {
          // Lookup the full entry in cweData
          const cweEntry = getDetailsByCwe(cwe)

          // If found, build “A01:2021 Broken Access Control” or fallback to the plain code
          let owaspWithGroup = vul.OWASP
          if (cweEntry) {
            owaspWithGroup = `${cweEntry.owasp} ${cweEntry.group}`
          }

          const key = `${owaspWithGroup}|${cwe}|${rt.test}`

          if (!testMap.has(key)) {
            testMap.set(key, {
              owasp: owaspWithGroup,
              cwe,
              test: rt.test,
              detections: [],
            })
          }

          testMap.get(key).detections.push({
            dast: rt.dast,
            detected: rt.detectedCWEs.includes(cwe),
            profiles: dockerCompose.services[rt.test]?.profiles || [],
          })
        }
      })
    })
  })

  const hydratedTests = Array.from(testMap.values())

  return { hydratedHeatmapTests, hydratedTests, vulnerabilities: dataJson.vulnerabilities }
}

// Return all vulnerabilities matching a given OWASP code
export function getDetailsByOwasp(owaspCode: string) {
  return cweDataJson.cweData.filter((item) => item.owasp === owaspCode)
}

// Return the single vulnerability object matching a given CWE (assuming unique)
export function getDetailsByCwe(cweId: number) {
  return cweDataJson.cweData.find((item) => item.cwe === cweId)
}
