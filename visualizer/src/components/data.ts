import type { DockerCompose, VulnerabilitiesData, HydratedTest } from './types';

const dockerCompose: DockerCompose = (await import('../../../docker-compose.yml')).default;
const dataJson: VulnerabilitiesData = (await import('../../../data.json')).default;

export const loadData = () => {
  const hydratedTests: HydratedTest[] = dataJson.recordedTests.map(test => ({
    ...test,
    profiles: dockerCompose.services[test.test]?.profiles || []
  }));

  return { hydratedTests, vulnerabilities: dataJson.vulnerabilities };
};
