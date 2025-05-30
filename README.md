# AppSec Detection Framework (ASDF)

A framework for understanding the capabilities of automated detection methods at identifying classes of application security vulnerabilities.

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Running Tests](#running-tests)
  - [Management Interface](#management-interface)
  - [Recorded Tests Generator](#recorded-tests-generator)
- [Project Structure](#project-structure)
  - [Tests](#tests)
  - [Data Management](#data-management)
    - [data.json](#datajson)
    - [Analysis Utilities](#analysis-utilities)
  - [Docker Configuration](#docker-configuration)
    - [docker-compose.yml](#docker-composeyml)
    - [Dockerfile](#dockerfile)
    - [Vulnerable Code](#vulnerable-code)
- [Data Visualization](#data-visualization)
  - [Setup](#setup)
  - [Features](#features)
  - [Linting](#linting)
- [Contributing](#contributing)
- [License](#license)

## Overview

ASDF is designed to evaluate and compare the effectiveness of various security scanners in detecting common web application vulnerabilities. It provides a standardized set of vulnerable applications and a framework for testing security tools against them.

## Requirements

- [Bun](https://bun.sh) - JavaScript runtime and package manager
- [Docker](https://www.docker.com) - Container platform
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container Docker application tool

## Getting Started

### Running Tests

To test a new scanner or set of exploits, you'll use Pocman, which orchestrates the proof of concept applications in this repository.

1. Install dependencies:
   ```sh
   bun install
   ```

2. Run Pocman:
   ```sh
   ./pocman.ts
   ```

3. Navigate through test batches:
   - Pocman deploys proofs of concept in batches (default: 15 images) to avoid resource constraints
   - Enter 'next' in the command prompt to navigate to the next batch
   - The index of proof of concepts will be hosted on `localhost:3000`
   - Point your scanner to this URL to crawl all available PoCs

#### Management Interface

Pocman now includes a web-based management interface that allows you to control the test batches through a browser:

1. Access the management interface at `http://localhost:3001` while Pocman is running
2. Use the control buttons to:
   - Navigate to the next batch
   - Return to the previous batch
   - Stop the current batch
   - Start the current batch
   - Restart the current batch
3. View the current batch status
4. Generate recordedTests output for your scanner

##### Recorded Tests Generator

The management interface now includes a utility to help generate the `recordedTests` output for your scanner:

1. Enter your scanner name (e.g., "zap_v2.16.0")
2. Provide a description of your scanner's configuration in the scan profile field
3. For each test in the current batch:
   - Select which CWEs were detected by checking the boxes in the "Detected CWEs" column
   - Select which CWEs were not detected by checking the boxes in the "Undetected CWEs" column
   - A CWE can only be in one category at a time (detected or undetected)
4. Click "Generate Recorded Tests" to create the JSON output
5. Copy the output and add it to your `data.json` file

This utility makes it easy to record your scanner's test results in the correct format for the ASDF framework.

For more information, run:
```sh
bun install && ./pocman.ts --help
```

## Project Structure

### Tests

The `tests` folder contains all of the definitions for each of the vulnerabilities. The structure of this folder should be:

```bash
tests/
├── test-1/               # The test ID of the vulnerability (increments)
│   └── v1/               # The version of the specific test
│       ├── Dockerfile    # The dockerfile for building the test environment
│       └── index.php     # The vulnerable code (can be any language)
├── test-2/
│   └── v1/
│       ├── Dockerfile
│       └── index.js
└── test-3/
    └── v1/
        ├── Dockerfile
        └── index.py
```

Each test folder follows the pattern `test-{id}` where `id` is a sequential number. Within each test folder, there can be multiple versions (v1, v2, etc.) of the same vulnerability test.

### Data Management

#### data.json

This is the file that contains our test data and the OWASP top 10 CWEs. The file has two main sections:

1. `vulnerabilities`: An array of OWASP Top 10 2021 categories and their associated CWEs
2. `recordedTests`: An object where each key is a scanner name and the value contains the scanner's profile and test results

Example structure:

```json
{
  "vulnerabilities": [
    {
      "OWASP": "A01:2021",
      "CWEDetails": [
        {
          "id": 22,
          "title": "Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')",
          "tests": ["test_1_v1", "test_1_v2"]
        }
      ],
      "group": "Broken Access Control"
    }
  ],
  "recordedTests": {
    "scanner_name": {
      "scanProfile": "Description of the scanner's capabilities and purpose",
      "tests": [
        {
          "test": "test_1_v1",
          "detectedCWEs": [22, 693],
          "undetectedCWEs": [23],
          "updatedAt": 1740999692
        }
      ]
    }
  }
}
```

When adding new test results:

1. The scanner name should include the version number (e.g., "zap_v2.16.0")
2. The `scanProfile` should describe the scanner's configuration
3. Each test result should include:
   - `test`: The name of the docker container of the test
   - `detectedCWEs`: Array of CWE IDs that were detected
   - `undetectedCWEs`: Array of CWE IDs that were not detected
   - `updatedAt`: Unix timestamp of when the test occurred

> [!TIP]
> You can use the Recorded Tests Generator in the management interface to easily create this output in the correct format.

#### Analysis Utilities

The framework includes utilities to help analyze the data.json file and identify gaps in test coverage:

##### Find Missing Tests

```bash
bun run utils/findMissingTests.ts [options]
```

This utility analyzes scanner results to identify:
- Missing tests that haven't been run by a scanner
- Missing CWEs that should be detected but aren't
- Incorrect CWE associations (CWEs that are reported but shouldn't be)

Options:
- `--file <path>`: Path to the data.json file (default: 'data.json')
- `-v, --verbose`: Enable verbose output

##### Find Uncovered CWEs

```bash
bun run utils/findUncoveredCwes.ts [options]
```

This utility identifies CWEs that lack test coverage in the framework:
- CWEs with no associated tests
- CWEs with limited coverage (only one test)

Options:
- `--file <path>`: Path to the data.json file (default: 'data.json')
- `-v, --verbose`: Enable verbose output

##### Check Profile Consistency

```bash
bun run utils/checkProfileConsistency.ts
```

This utility verifies that the profiles in docker-compose.yml match the CWEs and OWASP categories associated with tests in data.json. It performs case-insensitive matching and identifies:

- Tests in docker-compose.yml that don't exist in data.json
- CWEs in docker-compose.yml profiles that don't exist in data.json
- OWASP categories in docker-compose.yml profiles that don't exist in data.json
- Tests in data.json that don't exist in docker-compose.yml
- CWEs in data.json that aren't referenced in docker-compose.yml profiles
- OWASP categories in data.json that aren't referenced in docker-compose.yml profiles
- Tests that are missing the "all" profile in docker-compose.yml

The utility will exit with code 1 if any inconsistencies are found, making it suitable for CI/CD pipelines.

> [!TIP]
> Use these utilities regularly to identify gaps in test coverage and ensure your scanner results are accurate.

### Docker Configuration

#### docker-compose.yml

The `docker-compose.yml` file manages the deployment of groups of containers.

##### Port Configuration

Each container should port forward from a local port on the host using an unreserved port (above 1024), following the convention `8 {test ID} {version number}`:
- test 1 v1 would use port `8011`
- test 2 v1 would use port `8021`

##### Service Profiles

The `profiles` should be defined for each service to include:

- The language the vulnerability was written in (e.g., php, js, python)
- The webserver technology in use (e.g., apache, nginx)
- CWE IDs associated with the vulnerability (e.g., cwe-23)
- The OWASP Top 10 2021 category code (e.g., a01:2021)
- The profile of "all" to ensure these are run by default

Example entry:

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
      - all
```

#### Dockerfile

The `Dockerfile` is responsible for deploying the vulnerable code. It should:

1. Set up the appropriate runtime environment
2. Install necessary dependencies
3. Copy the vulnerable code into the container
4. Configure the web server to serve the application

#### Vulnerable Code

The vulnerable code (typically named `index.php`, `index.js`, etc.) should:

- Be brief and easily readable
- Focus solely on demonstrating the vulnerability
- Avoid unnecessary styling or details that don't contribute to the vulnerability
- Be properly commented to explain the vulnerability

## Data Visualization

The `visualizer` directory contains ASDFviz, a Vue-based visualization tool for analyzing the test results.

### Setup

1. Navigate to the visualizer directory:
   ```sh
   cd visualizer
   ```

2. Install dependencies:
```sh
bun install -D
```

3. Start the development server:
```sh
bun dev
```

4. Access the visualization at `http://localhost:5173`

### Features

- Coverage gap analysis
- Detection rate comparison
- OWASP category analysis
- CWE-specific analysis
- Export functionality for test results

### Linting

To lint the code with ESLint:
```sh
bun lint
```

## Contributing

Contributions are welcome! There are two main ways to contribute to ASDF:

### Adding a New Test

You can identify CWEs that we don't currently have tests for by running `bun run utils/findUncoveredCwes.ts`

To add a test into the collection:

1. Create a new test directory in `tests/` following the naming convention `test-{id}/v1/`
2. Create a `Dockerfile` that:
   - Sets up the appropriate runtime environment
   - Installs necessary dependencies
   - Copies the vulnerable code
   - Configures the web server
3. Create the vulnerable code file (e.g., `index.php`, `index.js`) that:
   - Demonstrates a specific vulnerability
   - Is brief and easily readable
   - Includes clear comments explaining the vulnerability
4. Update `docker-compose.yml` to include your test with appropriate:
   - Port mapping (following the `8{test_id}{version}` convention)
   - Service profiles (language, webserver, CWE IDs, OWASP category)
5. Add your test to `data.json` under the appropriate OWASP category and CWE
6. Validate your changes using the analysis utilities:
   ```sh   
   # Ensure profile consistency across data.json and docker-compose.yml
   bun run utils/checkProfileConsistency.ts
   ```

### Adding Scan Results

1. Run your security scanner against the test suite using Pocman
2. Use the Recorded Tests Generator in the management interface (`http://localhost:3001`) to:
   - Enter your scanner name and version
   - Provide a detailed scan profile
   - Record which CWEs were detected/undetected for each test
3. Add the generated JSON to `data.json` under the `recordedTests` section
4. Ensure your scanner name includes the version number (e.g., "zap_v2.16.0")
5. Include a detailed `scanProfile` that describes your scanner's configuration
6. Validate your scan results:
   ```sh
   # Check for missing tests in your scan results
   bun run utils/findMissingTests.ts
   ```

> [!IMPORTANT]
> Always run the validation utilities before submitting your contribution. They help ensure:
> - All tests are properly documented in data.json
> - CWEs are correctly associated with tests
> - Docker profiles match the documented vulnerabilities
> - No tests or CWEs are missing from your scan results

For both types of contributions:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-contribution`)
3. Commit your changes (`git commit -m 'Add test/scan results for [description]'`)
4. Push to the branch (`git push origin feature/your-contribution`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
