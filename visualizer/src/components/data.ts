import type { DockerCompose, VulnerabilitiesData, HydratedTest, HydratedHeatmapTest } from './types'

const dockerCompose: DockerCompose = (await import('../../../docker-compose.yml')).default
const dataJson: VulnerabilitiesData = (await import('../../../data.json')).default

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
          const key = `${vul.OWASP}|${cwe}|${rt.test}`

          if (!testMap.has(key)) {
            testMap.set(key, {
              owasp: vul.OWASP,
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
