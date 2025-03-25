export interface DockerService {
  image: string
  build: {
    context: string
    dockerfile: string
  }
  ports: string[]
  profiles: string[]
}

export interface Vulnerability {
  OWASP: string
  CWE: number[]
}

export interface RecordedTest {
  dast: string
  detectedCWEs: number[]
  undetectedCWEs: number[]
  test: string
  updatedAt: number
}

export interface HydratedHeatmapTest extends RecordedTest {
  profiles: string[]
}

export interface HydratedTest {
  owasp: string
  cwe: number
  test: string
  detections: {
    dast: string
    detected: boolean
    profiles: string[]
  }[]
}

export interface DockerCompose {
  services: {
    [key: string]: DockerService
  }
}

export interface VulnerabilitiesData {
  vulnerabilities: Vulnerability[]
  recordedTests: RecordedTest[]
}

export interface WeightedScore {
  dast: string
  score: number
}
