#!/usr/bin/env bun
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';
import minimist from 'minimist';

interface MinimistOpts {
  string?: string[];
  number?: string[];
  boolean?: string[];
  alias?: { [key: string]: string };
  default?: { [key: string]: any };
}

// command line arguments
const args = minimist(process.argv.slice(2), {
  string: ['language'],
  alias: { l: 'language' },
});

const helpMessage = `
  Test Case Creation Utility
  ==========================
  Creates a new test case folder with default files.

  Usage:
    bun run utils/create-test-case.ts <test-number> --language <language>

  Arguments:
    test-number: The numerical ID for the new test case (e.g., 120).
    --language, -l: The programming language for the test (php, python, java, javascript).
`;

if (args._.length !== 1 || !args.language) {
  console.log(helpMessage);
  process.exit(1);
}

const testNumber = args._[0];
const language = args.language.toLowerCase();
const basePath = path.join(import.meta.dir, '..', 'tests', `test-${testNumber}`);

// gets the next version by checking what current version a test case is up to 
function getNextVersion() {
  if (!existsSync(basePath)) {
    return 'v1';
  }
  
  const existingVersions = readdirSync(basePath)
    .filter(name => name.startsWith('v'))
    .map(name => parseInt(name.substring(1)))
    .filter(n => !isNaN(n))
    .sort((a, b) => b - a);
    
  const nextVersion = existingVersions.length > 0 ? existingVersions[0] + 1 : 1;
  return `v${nextVersion}`;
}

const version = getNextVersion();
const testCasePath = path.join(basePath, version);

if (existsSync(testCasePath)) {
  console.error(`Error: Test case folder ${testCasePath} already exists.`);
  process.exit(1);
}

// Create directories
mkdirSync(testCasePath, { recursive: true });

// configurations for each of the languages
const languageConfig = {
  php: {
    sourceFile: 'index.php',
    internalPort: 80,
    serverProfile: 'apache',
    sourceContent: `<?php
echo "This is a PHP test case!";
?>`,
    dockerfile: `FROM php:8.2-apache
WORKDIR /var/www/html
COPY index.php .
EXPOSE 80`,
    extraFiles: [],
  }
  ,
  python: {
    sourceFile: 'app.py',
    internalPort: 80,
    serverProfile: 'flask',
    sourceContent: `from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'This is a Python test case!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)`,
    dockerfile: `FROM python:3.11-slim
WORKDIR /app
COPY app.py requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 80
CMD ["python", "app.py"]`,
    extraFiles: [{ name: 'requirements.txt', content: 'flask' }],
  },
  java: {
    sourceFile: 'index.html',
    internalPort: 80,
    serverProfile: 'tomcat',
    sourceContent: `<!DOCTYPE html>
<html>
<head>
    <title>Java Test Case</title>
</head>
<body>
    <h1>This is a Java test case!</h1>
</body>
</html>`,
    dockerfile: `FROM tomcat:9-jre11-openjdk-slim
COPY . /usr/local/tomcat/webapps/demo_app
EXPOSE 8080`,
    extraFiles: [{ name: 'pom.xml', content: '' }],
  },
  javascript: {
    sourceFile: 'index.js',
    internalPort: 80,
    serverProfile: 'express',
    sourceContent: `const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
    res.send('This is a Node.js test case');
});

app.listen(port, () => {
    console.log('Test ${testNumber} V${version.substring(1)} App listening on ' + port);
});`,
    dockerfile: `FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
EXPOSE 80
COPY . .
CMD ["node", "index.js"]`,
    extraFiles: [{ name: 'package.json', content: JSON.stringify({
        name: `test-${testNumber}-${version}`,
        version: "1.0.0",
        description: `Test ${testNumber} ${version}`,
        main: "index.js",
        scripts: { "start": "node index.js" },
        dependencies: { "express": "^4.18.2" }
    }, null, 2)}],
  }
};

const config = languageConfig[language as keyof typeof languageConfig];

if (!config) {
    console.error(`Error: Language '${language}' is not supported. Supported languages: ${Object.keys(languageConfig).join(', ')}`);
    process.exit(1);
}

// 1. Create source file
writeFileSync(path.join(testCasePath, config.sourceFile), config.sourceContent);

// 2. Create Dockerfile (using a standard name)
writeFileSync(path.join(testCasePath, 'Dockerfile'), config.dockerfile);

// 3. Create extra files (package.json, requirements.txt, etc.)
config.extraFiles.forEach(file => {
  writeFileSync(path.join(testCasePath, file.name), file.content);
});

console.log(`
✅ Successfully created new test case: test-${testNumber}/${version}
`);

// 4. Create variables for docker compose
const formattedTestNumber = String(testNumber).padStart(2, '0');
const versionNumber = version.substring(1);
const externalPort = `8${formattedTestNumber}${versionNumber}`;
const internalPort = config.internalPort;
const serverProfile = config.serverProfile;

// Generate Docker Compose Snippet
const dockerComposeService = `
  test_${testNumber}_${version}:
    image: test_${testNumber}_${version}:latest
    build:
      context: ./tests/test-${testNumber}/${version}/
      dockerfile: Dockerfile
    ports:
      - "${externalPort}:${internalPort}"
    profiles:
      - test-${testNumber}
      - ${language}
      - ${serverProfile}
      - cwe-(INSERT CWE NUMBER)
      - (INSERT OWASP CATEGORY NUMBER):2021
      - all
`;

console.log(`
Add the following snippet to your docker-compose.yml file:
----------------------------------------------------------------------
${dockerComposeService.trim()}
----------------------------------------------------------------------
`);