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
  test: string
  detectedCWEs: number[]
  undetectedCWEs: number[]
  updatedAt: number
}

export interface HydratedHeatmapTest extends RecordedTest {
  scanner: string
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
  recordedTests: {
    [scanner: string]: RecordedTest[]
  }
}

export interface WeightedScore {
  scanner: string
  score: number
}
