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
  test: string
  updatedAt: number
}

export interface HydratedTest extends RecordedTest {
  profiles: string[]
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
