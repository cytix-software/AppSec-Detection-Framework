#!/usr/bin/env bun
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';
import minimist from 'minimist';

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
    --language, -l: The programming language for the test (php, python, java).
`;

if (args._.length !== 1 || !args.language) {
  console.log(helpMessage);
  process.exit(1);
}

const testNumber = args._[0];
const language = args.language.toLowerCase();
const basePath = path.join(import.meta.dir, '..', 'tests', `test-${testNumber}`);

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

// File content templates
const dockerfileTemplates = {
  php: `FROM php:8.2-apache
WORKDIR /var/www/html
COPY index.php .
EXPOSE 80`,
  python: `FROM python:3.9-slim
WORKDIR /app
COPY app.py ./
RUN pip install requirements.txt
EXPOSE 80
CMD ["python", "app.py"]`,
  java: `FROM tomcat:9-jre11-openjdk-slim
COPY . /usr/local/tomcat/webapps/vulnerable_app
RUN sed -i 's/port="8080"/port="80"/g' /usr/local/tomcat/conf/server.xml
EXPOSE 80`
};

const sourceFileTemplates = {
  php: `<?php
echo "Hello from PHP test case!";
?>`,
  python: `from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Python test case!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)`,
  java: `<!DOCTYPE html>
<html>
<head>
    <title>Java Test Case</title>
</head>
<body>
    <h1>Hello from Java test case!</h1>
</body>
</html>`
};

const extraFiles = {
  python: 'requirements.txt',
  java: 'pom.xml'
};

const dockerfileName = 'Dockerfile';
const sourceFileName = language === 'php' ? 'index.php' : (language === 'python' ? 'app.py' : 'index.html');

// Create files
writeFileSync(path.join(testCasePath, dockerfileName), dockerfileTemplates[language as keyof typeof dockerfileTemplates]);
writeFileSync(path.join(testCasePath, sourceFileName), sourceFileTemplates[language as keyof typeof sourceFileTemplates]);

if (extraFiles[language as keyof typeof extraFiles]) {
  writeFileSync(path.join(testCasePath, extraFiles[language as keyof typeof extraFiles]), '');
}

// Get the server profile based on language
let serverProfile = '';
switch (language) {
  case 'php':
    serverProfile = 'apache';
    break;
  case 'python':
    serverProfile = 'flask';
    break;
  case 'java':
    serverProfile = 'tomcat';
    break;
  default:
    break;
}

// Format the external port number
const formattedTestNumber = String(testNumber).padStart(2, '0');
const versionNumber = version.substring(1);
const externalPort = `8${formattedTestNumber}${versionNumber}`;

console.log(`
✅ Successfully created new test case: test-${testNumber}/${version}
`);

// Generate docker-compose snippet
const dockerComposeService = `
  test_${testNumber}_${version}:
    image: test_${testNumber}_${version}:latest
    build:
      context: ./tests/test-${testNumber}/${version}/
      dockerfile: Dockerfile
    ports:
      - "${externalPort}:80"
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