export interface DockerService {
  image: string
  build: {
    context: string
    dockerfile: string
  }
  ports: string[]
  profiles: string[]
}

export interface CWEDetail {
  id: number
  title: string
}

export interface Vulnerability {
  OWASP: string
  CWEDetails: CWEDetail[]
  group: string
}

export interface RecordedTest {
  scanner: string
  detectedCWEs: number[]
  undetectedCWEs: number[]
  detectedCWEDetails: CWEDetail[]
  undetectedCWEDetails: CWEDetail[]
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
    scanner: string
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
  scanner: string
  score: number
}
