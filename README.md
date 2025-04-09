# AppSec Detection Framework (ASDF)

A framework for understanding the capabilities of automated detection methods at identifying classes of application security vulnerabilities.

## Project Structure

### Requirements

- [Bun](https://bun.sh)
- [Docker](https://www.docker.com)

### Running

In order to test a new scanner or set of exploits, you will need to test against the proofs of concept in this repository, this is done with Pocman.
Pocman is an application that orchestrates the proof of concepts in this repository so that exploits can be tested in batches. You can run it with `bun install && ./pocman.ts`.
Pocman deploys proofs of concept in batches, so as not to exceed resource constraints. By default it uses batches of 15 images. You can navigate to the next batch by entering 'next' into the command prompt that appears.
By default the index of proof of concepts will be hosted on `localhost:3000`, and this is where you should point your scanner, so that it can crawl all the available PoCs.

For further information you can use the command `bun install && ./pocman.ts --help`

### Tests

The `tests` folder contains all of the definitions for each of the vulnerabilities. The structure of this folder should be:

```bash
tests/
├── test-id/                # The test ID of the vulnerability (increments)
|   └── version             # The version of the specific test
|       ├── Dockerfile      # The dockerfile
|       └── index.lang      # The vulnerable code
└── test-1
|   └── v1
|       ├── Dockerfile
|       └── index.php
visualizer/
docker-compose.yml
data.json                   # The test results dataset
```

### data.json

This is the file that contains our test data and the OWASP top 10 CWEs. When a new test is performed, a new item should be added to the `"recordedTests"` array, with the following values:

```
{
  "scanner": <the name of the scanner being tested, including the version number as a string>,
  "test": <the name of the docker container of the test, this should be a string>,
  "detectedCWEs": <an array of CWE ID, where each ID represents the vulnerability detected>,
  "undetectedCWEs" <an array of CWE ID, where each ID represents the vulnerability not detected>,
  "updatedAt": <the unix timestamp of when the test occured, this should be a number>
}
```

### docker-compose.yml

The `docker-compose.yml` file should be used to manage the deployment of groups of containers.

The container should port forward from a local port on the host. It should use an unreserved (above 1024) port, following the convention `8 {test ID} {version number}` (e.g. test 1 v1 would use port `8011`, test 2 v1 would use port `8021`).

The `profiles` should be defined for each service to include:

- The language the vulnerability was written in
- The webserver technology in use
- CWE IDs associated with the vulnerability
- The OWASP Top 10 2021 category code

An example entry can be seen below:

```yaml
services:
  test_1_v1:
    image: test_1_v1:latest
    build:
      context: tests/test-1/v1/
      dockerfile: Dockerfile
    ports:
      - "8011:80"
    profiles:
      - a01:2021
      - php
      - apache
      - cwe-23
      - cwe-22
```

### Dockerfile

The `Dockerfile` is responsible for deploying the vulnerable code.

### index.lang

The `index` file is simply there as an example of where the vulnerable code should live. This can actually be multiple files if required.

The vulnerable code should be brief, easily readable, and should avoid any unnecessary styling or other details that do not directly contribute to introducing the vulnerability or making it exploitable.

## Data Visualization (ASDFviz)

The `visualizer` directory contains a visualization page built using Vue for ASDF. It pulls data from the `docker-compose.yml` and `data.json` at the top level of the repository, and provides various graphs and search tools for navigating the data.

### Project Setup
*Ensure you are in the visualizer directory.*

```sh
bun install -D
```

### Compile

```sh
bun dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```