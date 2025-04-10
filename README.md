# AppSec Detection Framework (ASDF)

A framework for understanding the capabilities of automated detection methods at identifying classes of application security vulnerabilities.

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
  - [Tests](#tests)
  - [Data Management](#data-management)
  - [Docker Configuration](#docker-configuration)
- [Data Visualization](#data-visualization)
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

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.