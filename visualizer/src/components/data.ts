import type { DockerCompose, VulnerabilitiesData, HydratedTest, HydratedHeatmapTest, CWEDetail } from './types'

const dockerCompose: DockerCompose = (await import('../../../docker-compose.yml')).default
const dataJson: VulnerabilitiesData = (await import('../../../data.json')).default

export const loadData = () => {
  const hydratedHeatmapTests: HydratedHeatmapTest[] = dataJson.recordedTests.map((test) => ({
    ...test,
    profiles: dockerCompose.services[test.test]?.profiles || [],
  }))

  const testMap = new Map<string, any>()

  dataJson.vulnerabilities.forEach((vul) => {
    vul.CWEDetails.forEach((cweDetail) => {
      const cwe = cweDetail.id
      dataJson.recordedTests.forEach((rt) => {
        if (rt.detectedCWEs.includes(cwe) || rt.undetectedCWEs?.includes(cwe)) {
          // Build "A01:2021 Broken Access Control" using the group from the vulnerability level
          const owaspWithGroup = `${vul.OWASP} ${vul.group}`

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
            scanner: rt.scanner,
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
  return dataJson.vulnerabilities
    .filter(vuln => vuln.OWASP === owaspCode)
    .flatMap(vuln => vuln.CWEDetails)
}

// Return the single vulnerability object matching a given CWE (assuming unique)
export function getDetailsByCwe(cweId: number): CWEDetail | undefined {
  for (const vuln of dataJson.vulnerabilities) {
    const cweDetail = vuln.CWEDetails.find(detail => detail.id === cweId)
    if (cweDetail) {
      return cweDetail
    }
  }
  return undefined
}
