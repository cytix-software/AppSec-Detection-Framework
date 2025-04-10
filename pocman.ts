#!/usr/bin/env bun
import { readFile } from 'fs/promises';
import YAML from 'yaml';
import Koa from 'koa';
import Router from '@koa/router';
import readline from 'readline';
import path from 'path';
import _ from 'lodash';
import minimist from 'minimist';
import { html, safeHtml } from 'common-tags';

// Add type definitions for minimist
interface MinimistOpts {
  string?: string[];
  number?: string[];
  boolean?: string[];
  alias?: { [key: string]: string };
  default?: { [key: string]: any };
}

const args = minimist(process.argv.slice(2), {
  string: ['compose-path', 'profiles'],
  number: ['batch-size', 'port'],
  boolean: ['help'],
  alias: { h: 'help' },
  default: {
    'compose-path': './docker-compose.yml',
    'batch-size': 15,
    profiles: 'php',
    port: 3000
  }
} as MinimistOpts);

if (args.help) {
  console.log(`
  Pocman
  ================================
  A batched exploit proof-of-concept manager for security testing

  Usage:
    bun run app.ts [options]

  Options:
    --compose-path  Path to docker-compose file (default: ./docker-compose.yml)
    --batch-size    Number of services per batch (default: 15)
    --profiles      Comma-separated list of profiles to manage (default: php)
    --port          Web server port (default: 3000)
    --help          Show this help message

  REPL Commands:
    next      - Activate next batch
    previous  - Return to previous batch
    stop      - Stop current batch containers
    start     - Start current batch containers
    restart   - Restart current batch containers
    status    - Show current active services
    help      - Show this help message
    quit/exit - Exit the application
  `);
  process.exit(0);
}

type DockerService = {
  name: string;
  profiles: string[];
  ports: string[];
};

type ServiceBatch = {
  profile: string;
  chunkIndex: number;
  services: string[];
  urls: string[];
};

// Add type definitions
interface DockerComposeConfig {
  services: {
    [key: string]: {
      image: string;
      build?: {
        context: string;
        dockerfile: string;
      };
      ports?: string[];
      profiles?: string[];
    };
  };
}

const composeDirectory = path.dirname(path.resolve(args['compose-path']));
const profiles = args.profiles.split(',');

function createDockerManager() {
  return {
    async up(services: string[]) {
      await this.execute('up', ['-d', ...services]);
    },

    async stop(services: string[]) {
      if (services.length > 0) {
        await this.execute('stop', services);
      }
    },

    async execute(command: string, args: string[]) {
      const process = Bun.spawn(
        ['docker', 'compose', command, ...args],
        { cwd: composeDirectory, stdout: 'inherit', stderr: 'inherit' }
      );

      const exitCode = await process.exited;
      if (exitCode !== 0) {
        throw new Error(`Docker ${command} failed with code ${exitCode}`);
      }
    }
  };
}

function createBatchManager(docker = createDockerManager()) {
  let currentBatch: ServiceBatch | null = null;
  let batchQueue: ServiceBatch[] = [];
  let batchHistory: ServiceBatch[] = [];

  return {
    async initialize() {
      const services = await this.parseDockerCompose();
      batchQueue = this.createProfileBatches(services);
    },

    async parseDockerCompose() {
      const content = await readFile(args['compose-path'], 'utf8');
      const config = YAML.parse(content) as DockerComposeConfig;
      return Object.entries(config.services)
        .map(([name, cfg]) => ({
          name,
          profiles: cfg.profiles || [],
          ports: cfg.ports || []
        }));
    },

    createProfileBatches(services: DockerService[]) {
      const grouped = _.groupBy(services, s =>
        _.intersection(s.profiles, profiles)[0]
      );

      return profiles.flatMap(profile =>
        _.chunk(grouped[profile] || [], args['batch-size'])
          .map((chunk, i) => ({
            profile,
            chunkIndex: i,
            services: chunk.map(s => s.name),
            urls: chunk.flatMap(s =>
              s.ports.map(p => `http://localhost:${p.split(':')[0]}`)
            )
          }))
      );
    },

    async getNextBatch() {
      const next = batchQueue.shift();
      if (!next) return null;

      if (currentBatch) {
        batchHistory.push(currentBatch);
        await docker.stop(currentBatch.services);
      }

      await docker.up(next.services);
      return currentBatch = next;
    },

    async getPreviousBatch() {
      if (!batchHistory.length) return null;
      const previous = batchHistory.pop()!;

      if (currentBatch) {
        await docker.stop(currentBatch.services);
        batchQueue.unshift(currentBatch);
      }

      await docker.up(previous.services);
      return currentBatch = previous;
    },

    async stopCurrentBatch() {
      if (!currentBatch) return;
      await docker.stop(currentBatch.services);
    },

    async startCurrentBatch() {
      if (!currentBatch) return;
      await docker.up(currentBatch.services);
    },

    async restartCurrentBatch() {
      if (!currentBatch) return;
      await docker.stop(currentBatch.services);
      await docker.up(currentBatch.services);
    },

    getCurrentBatch() { return currentBatch },
    getBatchQueue() { return batchQueue }
  };
}

function createHtml(batch: ServiceBatch | null) {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>AppSec Detection Framework</title>
        <style>
          :root {
            --primary: #FF822E;
            --primary-dark: #DA4100;
            --background: #020E1E;
            --surface: #0E1E33;
            --text-primary: #FFFFFF;
            --text-secondary: #8181AC;
            --accent: #216FED;
            --warning: #FF4D36;
          }

          body {
            font-family: system-ui;
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
            color: var(--text-primary);
            background: var(--background);
            min-height: 100vh;
          }

          .header {
            background: var(--surface);
            padding: 2rem;
            margin: -2rem -1rem 2rem;
            border-bottom: 2px solid var(--primary-dark);
          }

          .footer {
            margin-top: 3rem;
            color: var(--text-secondary);
            text-align: center;
            padding: 1rem;
            border-top: 1px solid var(--surface);
          }

          h1 {
            color: var(--primary);
            margin: 0 0 0.5rem;
            font-size: 2.2rem;
          }

          h2 {
            color: var(--primary);
            margin: 0;
            font-weight: 400;
            font-size: 1.1rem;
            opacity: 0.9;
          }

          .service-link {
            padding: 1rem;
            border-radius: 6px;
            display: block;
            transition: all 0.2s;
            background: rgba(255, 130, 46, 0.08);
            margin-bottom: 0.5rem;
            color: var(--primary);
            text-decoration: none;
            border: 1px solid var(--surface);
          }

          .service-link:hover {
            background: rgba(255, 130, 46, 0.16);
            border-color: var(--primary);
            transform: translateX(4px);
          }

          .batch-info {
            background: var(--surface);
            padding: 1.5rem;
            border-radius: 8px;
            margin: 2rem 0;
          }

          .batch-info h3 {
            color: var(--primary);
            margin: 0 0 1rem;
            font-size: 1.1rem;
          }

          .url-subtext {
            color: var(--text-secondary);
            font-size: 0.9em;
            margin-left: 8px;
          }

          .no-services {
            color: var(--text-secondary);
            text-align: center;
            padding: 2rem;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AppSec Detection Framework</h1>
          <h2>Proof-of-Concept Management Console</h2>
        </div>

        ${batch ? html`
          <div class="batch-info">
            <h3>${safeHtml(batch.profile)} • Group ${batch.chunkIndex + 1}</h3>
            <ul>
              ${batch.urls.map((url, i) => html`
                <li>
                  <a class="service-link" href="${safeHtml(url)}" target="_blank">
                    ${safeHtml(humanizeServiceName(batch.services[i]))}
                    <span class="url-subtext">${safeHtml(url)}</span>
                  </a>
                </li>
              `)}
            </ul>
          </div>
        ` : html`<div class="no-services">No active services running</div>`}

        <div class="footer">
          Proof of Concept Orchestration Platform by Cytix
        </div>
      </body>
    </html>
  `;
}

function showWelcome() {
  console.log(`
  Pocman - Batched Exploit Proof-of-Concept Manager
  =================================================
  Version 1.0.0 • By Cytix • ${new Date().getFullYear()}

  Configuration:
  - Docker compose: ${args['compose-path']}
  - Batch size: ${args['batch-size']}
  - Profiles: ${profiles.join(', ')}
  - Web interface port: ${args.port}
  `);
}

// Add management server setup
let batchManager: ReturnType<typeof createBatchManager>;

const managementApp = new Koa();
const managementRouter = new Router();

managementRouter.get('/api/status', async (ctx) => {
  const batch = batchManager.getCurrentBatch();
  ctx.body = {
    currentBatch: batch,
    queue: batchManager.getBatchQueue()
  };
});

managementRouter.post('/api/next', async (ctx) => {
  const batch = await batchManager.getNextBatch();
  ctx.body = { success: true, batch };
});

managementRouter.post('/api/previous', async (ctx) => {
  const batch = await batchManager.getPreviousBatch();
  ctx.body = { success: true, batch };
});

managementRouter.post('/api/stop', async (ctx) => {
  await batchManager.stopCurrentBatch();
  ctx.body = { success: true };
});

managementRouter.post('/api/start', async (ctx) => {
  await batchManager.startCurrentBatch();
  ctx.body = { success: true };
});

managementRouter.post('/api/restart', async (ctx) => {
  await batchManager.restartCurrentBatch();
  ctx.body = { success: true };
});

// Add a function to get service profiles
async function getServiceProfiles(serviceName: string): Promise<string[]> {
  try {
    const content = await readFile(args['compose-path'], 'utf8');
    const config = YAML.parse(content) as DockerComposeConfig;
    return config.services[serviceName]?.profiles || [];
  } catch (error) {
    console.error(`Error getting profiles for ${serviceName}:`, error);
    return [];
  }
}

// Update the healthcheck endpoint to include profiles
managementRouter.get('/api/healthcheck', async (ctx) => {
  const batch = batchManager.getCurrentBatch();
  if (!batch) {
    ctx.body = { status: 'no_active_batch' };
    return;
  }

  const healthResults = await Promise.all(
    batch.urls.map(async (url, index) => {
      const serviceName = batch.services[index];
      const profiles = await getServiceProfiles(serviceName);
      
      try {
        const response = await fetch(url);
        return {
          service: serviceName,
          url,
          status: response.ok ? 'healthy' : 'unhealthy',
          statusCode: response.status,
          profiles
        };
      } catch (error) {
        return {
          service: serviceName,
          url,
          status: 'unreachable',
          error: error.message,
          profiles
        };
      }
    })
  );

  ctx.body = { results: healthResults };
});

// Add a utility endpoint for generating recordedTests output
managementRouter.get('/api/recorded-tests', async (ctx) => {
  const batch = batchManager.getCurrentBatch();
  if (!batch) {
    ctx.body = { status: 'no_active_batch' };
    return;
  }

  // Get all CWEs from the docker-compose.yml file
  const content = await readFile(args['compose-path'], 'utf8');
  const config = YAML.parse(content) as DockerComposeConfig;
  
  const cweMap = new Map<string, string[]>();
  
  // Extract CWEs from profiles
  Object.entries(config.services).forEach(([serviceName, service]) => {
    const cwes = service.profiles?.filter(profile => profile.startsWith('cwe-')) || [];
    cweMap.set(serviceName, cwes);
  });

  // Generate recordedTests output
  const recordedTests = {
    scanner_name: "your_scanner_name",
    scanProfile: "Description of your scanner's capabilities and purpose",
    tests: batch.services.map(service => {
      const cwes = cweMap.get(service) || [];
      return {
        test: service,
        detectedCWEs: [],
        undetectedCWEs: cwes.map(cwe => parseInt(cwe.replace('cwe-', ''))),
        updatedAt: Math.floor(Date.now() / 1000)
      };
    })
  };

  ctx.body = { recordedTests };
});

// Add an endpoint to get existing scanner results
managementRouter.get('/api/existing-scanner-results', async (ctx) => {
  try {
    const dataPath = args['data-path'];
    const content = await readFile(dataPath, 'utf8');
    const data = JSON.parse(content);
    
    // Extract scanner names from recordedTests
    const scannerNames = Object.keys(data.recordedTests || {});
    
    ctx.body = { scannerNames };
  } catch (error) {
    console.error('Error reading data.json:', error);
    ctx.body = { error: 'Failed to read data.json' };
  }
});

managementRouter.get('/', async (ctx) => {
  ctx.body = createManagementHtml(batchManager.getCurrentBatch());
});

managementApp.use(managementRouter.routes());
managementApp.use(managementRouter.allowedMethods());

// TypeScript version of humanizeServiceName
function humanizeServiceName(serviceName: string): string {
  return serviceName
    .split('_')
    .map(_.startCase)
    .join(' ');
}

// Update the management HTML to include the recordedTests utility
function createManagementHtml(batch: ServiceBatch | null) {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pocman Management</title>
        <style>
          :root {
            --primary: #FF822E;
            --primary-dark: #DA4100;
            --background: #020E1E;
            --surface: #0E1E33;
            --text-primary: #FFFFFF;
            --text-secondary: #8181AC;
            --accent: #216FED;
            --warning: #FF4D36;
            --success: #00C853;
            --error: #FF3D00;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 20px;
            background: var(--background);
            color: var(--text-primary);
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
          }

          button {
            background: var(--surface);
            border: 1px solid var(--primary);
            color: var(--text-primary);
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
          }

          button:hover {
            background: var(--primary);
          }

          .status {
            background: var(--surface);
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .service-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 10px;
          }

          .service-card {
            background: var(--surface);
            padding: 15px;
            border-radius: 4px;
            border: 1px solid var(--accent);
          }

          .service-card h3 {
            margin: 0 0 10px 0;
            color: var(--primary);
          }

          .service-card p {
            margin: 5px 0;
            color: var(--text-secondary);
          }

          .service-card a {
            color: var(--accent);
            text-decoration: none;
          }

          .service-card a:hover {
            text-decoration: underline;
          }

          .health-status {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
          }

          .health-status.healthy {
            background-color: var(--success);
          }

          .health-status.unhealthy {
            background-color: var(--warning);
          }

          .health-status.unreachable {
            background-color: var(--error);
          }

          .health-status.unknown {
            background-color: var(--text-secondary);
          }

          .health-details {
            margin-top: 10px;
            font-size: 0.9em;
            color: var(--text-secondary);
          }

          .refresh-button {
            background: var(--accent);
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8em;
            margin-top: 10px;
          }

          .refresh-button:hover {
            background: var(--primary);
          }

          .profile-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
          }

          .profile-pill {
            background: var(--accent);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7em;
            white-space: nowrap;
          }

          .profile-pill.cwe {
            background: var(--warning);
          }

          .profile-pill.owasp {
            background: var(--primary);
          }

          .profile-pill.language {
            background: var(--success);
          }

          .profile-pill.server {
            background: var(--text-secondary);
          }

          .utility-section {
            background: var(--surface);
            padding: 20px;
            border-radius: 4px;
            margin-top: 20px;
          }

          .utility-section h2 {
            margin-top: 0;
            color: var(--primary);
          }

          .utility-form {
            display: grid;
            gap: 15px;
            margin-bottom: 20px;
          }

          .form-group {
            display: grid;
            gap: 5px;
          }

          .form-group label {
            font-weight: bold;
            color: var(--text-secondary);
          }

          .form-group input, .form-group textarea {
            background: var(--background);
            border: 1px solid var(--accent);
            color: var(--text-primary);
            padding: 8px;
            border-radius: 4px;
            font-family: inherit;
          }

          .form-group textarea {
            min-height: 100px;
            resize: vertical;
          }

          .json-output {
            background: var(--background);
            border: 1px solid var(--accent);
            color: var(--text-primary);
            padding: 15px;
            border-radius: 4px;
            font-family: monospace;
            white-space: pre-wrap;
            overflow-x: auto;
            margin-top: 15px;
          }

          .copy-button {
            background: var(--accent);
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8em;
            margin-top: 10px;
          }

          .copy-button:hover {
            background: var(--primary);
          }

          .cwe-selection {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;
          }

          .cwe-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .cwe-item input[type="checkbox"] {
            margin: 0;
          }

          .test-cwe-selection {
            margin-top: 15px;
            padding: 15px;
            background: var(--background);
            border-radius: 4px;
            border: 1px solid var(--accent);
          }

          .test-cwe-selection h4 {
            margin: 0 0 10px 0;
            color: var(--primary);
          }

          .cwe-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .cwe-column {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .cwe-column h5 {
            margin: 0 0 5px 0;
            color: var(--text-secondary);
          }

          .cwe-list {
            display: flex;
            flex-direction: column;
            gap: 5px;
            max-height: 200px;
            overflow-y: auto;
            padding: 5px;
            background: var(--surface);
            border-radius: 4px;
          }

          .cwe-item {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px;
            background: var(--background);
            border-radius: 4px;
          }

          .cwe-item input[type="checkbox"] {
            margin: 0;
          }

          .cwe-item label {
            flex: 1;
            cursor: pointer;
          }

          .cwe-actions {
            display: flex;
            gap: 5px;
          }

          .cwe-actions button {
            padding: 2px 5px;
            font-size: 0.8em;
          }

          .test-section {
            margin-top: 20px;
            padding: 15px;
            background: var(--surface);
            border-radius: 4px;
            border: 1px solid var(--accent);
          }

          .test-section h3 {
            margin: 0 0 10px 0;
            color: var(--primary);
          }

          .test-section p {
            margin: 5px 0;
            color: var(--text-secondary);
          }

          .scanner-selection {
            margin-bottom: 20px;
            padding: 15px;
            background: var(--surface);
            border-radius: 4px;
            border: 1px solid var(--accent);
          }

          .scanner-selection h4 {
            margin: 0 0 10px 0;
            color: var(--primary);
          }

          .scanner-options {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
          }

          .scanner-option {
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .scanner-option input[type="radio"] {
            margin: 0;
          }

          .scanner-select {
            width: 100%;
            padding: 8px;
            background: var(--background);
            border: 1px solid var(--accent);
            color: var(--text-primary);
            border-radius: 4px;
            font-family: inherit;
          }

          .scanner-select option {
            background: var(--background);
            color: var(--text-primary);
          }

          .cwe-button {
            width: 100%;
            padding: 8px;
            background: var(--background);
            border: 1px solid var(--accent);
            color: var(--text-primary);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
          }

          .cwe-button:hover {
            background: var(--accent);
          }

          .cwe-button.selected[data-category="detected"] {
            background: #00C853;
            border-color: #00A844;
          }

          .cwe-button.selected[data-category="undetected"] {
            background: #FF3D00;
            border-color: #CC3100;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pocman Management</h1>
            <div class="controls">
              <button onclick="executeCommand('previous')">Previous Batch</button>
              <button onclick="executeCommand('next')">Next Batch</button>
              <button onclick="executeCommand('stop')">Stop Current</button>
              <button onclick="executeCommand('start')">Start Current</button>
              <button onclick="executeCommand('restart')">Restart Current</button>
            </div>
          </div>

          <div class="status">
            <h2>Current Batch Status</h2>
            <div id="currentBatch">
              ${batch ? html`
                <p>Profile: ${batch.profile}</p>
                <p>Batch Index: ${batch.chunkIndex}</p>
                <div class="service-list" id="serviceList">
                  ${batch.services.map((service, index) => html`
                    <div class="service-card" id="service-${index}">
                      <h3>
                        <span class="health-status unknown" id="health-${index}"></span>
                        ${humanizeServiceName(service)}
                      </h3>
                      <p><a href="${batch.urls[index]}" target="_blank">${batch.urls[index]}</a></p>
                      <div class="profile-pills" id="profiles-${index}">
                        Loading profiles...
                      </div>
                      <div class="health-details" id="health-details-${index}">
                        Checking health...
                      </div>
                    </div>
                  `)}
                </div>
                <button class="refresh-button" onclick="checkHealth()">Refresh Health Status</button>
              ` : html`<p>No active batch</p>`}
            </div>
          </div>

          <div class="utility-section">
            <h2>Recorded Tests Generator</h2>
            <p>Use this utility to generate the recordedTests output for the current batch.</p>
            
            <div class="utility-form">
              <div class="scanner-selection">
                <h4>Scanner Selection</h4>
                <div class="scanner-options">
                  <div class="scanner-option">
                    <input type="radio" id="newScanner" name="scannerType" value="new" checked>
                    <label for="newScanner">New Scanner</label>
                  </div>
                  <div class="scanner-option">
                    <input type="radio" id="existingScanner" name="scannerType" value="existing">
                    <label for="existingScanner">Existing Scanner</label>
                  </div>
                </div>
                
                <div id="newScannerFields">
                  <div class="form-group">
                    <label for="scannerName">Scanner Name:</label>
                    <input type="text" id="scannerName" placeholder="e.g., zap_v2.16.0" value="your_scanner_name">
                  </div>
                  
                  <div class="form-group">
                    <label for="scanProfile">Scan Profile:</label>
                    <textarea id="scanProfile" placeholder="Description of your scanner's capabilities and purpose">Description of your scanner's capabilities and purpose</textarea>
                  </div>
                </div>
                
                <div id="existingScannerFields" style="display: none;">
                  <p>Tests should be appended to the existing scanner in data.json</p>
                </div>
              </div>
              
              <div id="testSections">
                Loading tests...
              </div>
              
              <button onclick="generateRecordedTests()">Generate Recorded Tests</button>
            </div>
            
            <div id="jsonOutput" class="json-output" style="display: none;"></div>
            <button id="copyButton" class="copy-button" onclick="copyToClipboard()" style="display: none;">Copy to Clipboard</button>
          </div>
        </div>

        <script>
          // JavaScript version of humanizeServiceName
          function humanizeServiceName(serviceName) {
            return serviceName
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }

          async function executeCommand(command) {
            try {
              const response = await fetch(\`/api/\${command}\`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              const data = await response.json();
              if (data.success) {
                window.location.reload();
              }
            } catch (error) {
              console.error('Error executing command:', error);
            }
          }

          function getProfileClass(profile) {
            if (profile.startsWith('cwe-')) {
              return 'cwe';
            } else if (profile.startsWith('a') && profile.includes(':')) {
              return 'owasp';
            } else if (['php', 'python', 'js', 'java', 'go', 'ruby'].includes(profile)) {
              return 'language';
            } else if (['apache', 'nginx', 'flask', 'express', 'spring'].includes(profile)) {
              return 'server';
            }
            return '';
          }

          async function checkHealth() {
            try {
              const response = await fetch('/api/healthcheck');
              const data = await response.json();
              
              if (data.results) {
                data.results.forEach((result, index) => {
                  const healthIndicator = document.getElementById(\`health-\${index}\`);
                  const healthDetails = document.getElementById(\`health-details-\${index}\`);
                  const profilePills = document.getElementById(\`profiles-\${index}\`);
                  
                  if (healthIndicator && healthDetails) {
                    // Update health indicator
                    healthIndicator.className = 'health-status ' + result.status;
                    
                    // Update health details
                    if (result.status === 'healthy') {
                      healthDetails.textContent = \`Status: Healthy (HTTP \${result.statusCode})\`;
                    } else if (result.status === 'unhealthy') {
                      healthDetails.textContent = \`Status: Unhealthy (HTTP \${result.statusCode})\`;
                    } else {
                      healthDetails.textContent = \`Status: Unreachable (\${result.error || 'Connection failed'})\`;
                    }
                  }

                  // Update profile pills
                  if (profilePills && result.profiles) {
                    profilePills.innerHTML = result.profiles.map(profile => 
                      \`<span class="profile-pill \${getProfileClass(profile)}">\${profile}</span>\`
                    ).join('');
                  }
                });
              }
            } catch (error) {
              console.error('Error checking health:', error);
            }
          }

          async function loadTests() {
            try {
              const response = await fetch('/api/recorded-tests');
              const data = await response.json();
              
              if (data.recordedTests) {
                const testSections = document.getElementById('testSections');
                if (testSections) {
                  testSections.innerHTML = data.recordedTests.tests.map((test, index) => {
                    const cweItems = test.undetectedCWEs.map(cwe => 
                      '<div class="cwe-item">' +
                        '<button type="button" class="cwe-button" id="detected-' + index + '-' + cwe + '" data-test-index="' + index + '" data-cwe="' + cwe + '" data-category="detected">' +
                          'CWE-' + cwe +
                        '</button>' +
                      '</div>'
                    ).join('');

                    const undetectedItems = test.undetectedCWEs.map(cwe => 
                      '<div class="cwe-item">' +
                        '<button type="button" class="cwe-button" id="undetected-' + index + '-' + cwe + '" data-test-index="' + index + '" data-cwe="' + cwe + '" data-category="undetected">' +
                          'CWE-' + cwe +
                        '</button>' +
                      '</div>'
                    ).join('');

                    return '<div class="test-section">' +
                      '<h3>' + humanizeServiceName(test.test) + '</h3>' +
                      '<p>Test: ' + test.test + '</p>' +
                      '<div class="test-cwe-selection">' +
                        '<h4>CWE Selection</h4>' +
                        '<div class="cwe-columns">' +
                          '<div class="cwe-column">' +
                            '<h5>Detected CWEs</h5>' +
                            '<div class="cwe-list" id="detected-' + index + '">' +
                              cweItems +
                            '</div>' +
                          '</div>' +
                          '<div class="cwe-column">' +
                            '<h5>Undetected CWEs</h5>' +
                            '<div class="cwe-list" id="undetected-' + index + '">' +
                              undetectedItems +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
                  }).join('');
                  
                  // Add event listeners after the HTML is rendered
                  document.querySelectorAll('.cwe-button').forEach(button => {
                    button.addEventListener('click', function() {
                      const testIndex = this.getAttribute('data-test-index');
                      const cwe = this.getAttribute('data-cwe');
                      const category = this.getAttribute('data-category');
                      handleCweSelection(testIndex, cwe, category);
                    });
                  });
                }
              }
            } catch (error) {
              console.error('Error loading tests:', error);
            }
          }

          // Function to handle CWE selection
          function handleCweSelection(testIndex, cwe, category) {
            const detectedButton = document.getElementById('detected-' + testIndex + '-' + cwe);
            const undetectedButton = document.getElementById('undetected-' + testIndex + '-' + cwe);
            
            if (category === 'detected') {
              if (detectedButton.classList.contains('selected')) {
                // If already selected, unmark it
                detectedButton.classList.remove('selected');
              } else {
                // If not selected, mark it and unmark the other category
                detectedButton.classList.add('selected');
                undetectedButton.classList.remove('selected');
              }
            } else {
              if (undetectedButton.classList.contains('selected')) {
                // If already selected, unmark it
                undetectedButton.classList.remove('selected');
              } else {
                // If not selected, mark it and unmark the other category
                undetectedButton.classList.add('selected');
                detectedButton.classList.remove('selected');
              }
            }
          }

          // Function to load existing scanner names
          async function loadExistingScanners() {
            try {
              const response = await fetch('/api/existing-scanner-results');
              const data = await response.json();
              
              if (data.scannerNames) {
                const select = document.getElementById('existingScannerName');
                if (select) {
                  select.innerHTML = '<option value="">Select a scanner</option>' +
                    data.scannerNames.map(name => '<option value="' + name + '">' + name + '</option>').join('');
                }
              }
            } catch (error) {
              console.error('Error loading existing scanners:', error);
            }
          }

          // Function to handle scanner type selection
          function handleScannerTypeChange() {
            const newScannerRadio = document.getElementById('newScanner');
            const existingScannerRadio = document.getElementById('existingScanner');
            const newScannerFields = document.getElementById('newScannerFields');
            const existingScannerFields = document.getElementById('existingScannerFields');
            
            if (newScannerRadio && existingScannerRadio && newScannerFields && existingScannerFields) {
              if (newScannerRadio.checked) {
                newScannerFields.style.display = 'block';
                existingScannerFields.style.display = 'none';
              } else {
                newScannerFields.style.display = 'none';
                existingScannerFields.style.display = 'block';
              }
            }
          }

          // Add event listeners for scanner type selection
          document.addEventListener('DOMContentLoaded', () => {
            const newScannerRadio = document.getElementById('newScanner');
            const existingScannerRadio = document.getElementById('existingScanner');
            
            if (newScannerRadio && existingScannerRadio) {
              newScannerRadio.addEventListener('change', handleScannerTypeChange);
              existingScannerRadio.addEventListener('change', handleScannerTypeChange);
            }
            
            checkHealth();
            loadTests();
          });

          async function generateRecordedTests() {
            try {
              const newScannerRadio = document.getElementById('newScanner');
              const scannerNameInput = document.getElementById('scannerName');
              const scanProfileInput = document.getElementById('scanProfile');
              
              if (!newScannerRadio || !scannerNameInput || !scanProfileInput) {
                throw new Error('Required form elements not found');
              }
              
              const scannerName = newScannerRadio.checked 
                ? scannerNameInput.value
                : '';
              
              const scanProfile = newScannerRadio.checked
                ? scanProfileInput.value
                : '';
              
              if (newScannerRadio.checked && !scannerName) {
                alert('Please enter a scanner name');
                return;
              }
              
              const response = await fetch('/api/recorded-tests');
              const data = await response.json();
              
              if (data.recordedTests) {
                // Update detected and undetected CWEs for each test
                data.recordedTests.tests.forEach((test, index) => {
                  const detectedCWEs = Array.from(document.querySelectorAll('#detected-' + index + ' .cwe-button.selected'))
                    .map(button => parseInt(button.getAttribute('data-cwe')));
                  
                  const undetectedCWEs = Array.from(document.querySelectorAll('#undetected-' + index + ' .cwe-button.selected'))
                    .map(button => parseInt(button.getAttribute('data-cwe')));
                  
                  test.detectedCWEs = detectedCWEs;
                  test.undetectedCWEs = undetectedCWEs;
                });
                
                // If appending to existing scanner, only include the tests array
                const output = newScannerRadio.checked
                  ? {
                      ...data.recordedTests,
                      scanner_name: scannerName,
                      scanProfile: scanProfile
                    }
                  : data.recordedTests.tests;
                
                // Display the JSON
                const jsonOutput = document.getElementById('jsonOutput');
                const copyButton = document.getElementById('copyButton');
                
                if (jsonOutput && copyButton) {
                  jsonOutput.textContent = JSON.stringify(output, null, 2);
                  jsonOutput.style.display = 'block';
                  copyButton.style.display = 'inline-block';
                }
              }
            } catch (error) {
              console.error('Error generating recorded tests:', error);
            }
          }

          function copyToClipboard() {
            const jsonOutput = document.getElementById('jsonOutput');
            if (jsonOutput) {
              const text = jsonOutput.textContent;
              navigator.clipboard.writeText(text).then(() => {
                alert('Copied to clipboard!');
              }).catch(err => {
                console.error('Failed to copy: ', err);
              });
            }
          }

          // Check health on page load
          document.addEventListener('DOMContentLoaded', () => {
            checkHealth();
            loadTests();
          });

          // Auto-refresh status every 5 seconds
          setInterval(async () => {
            try {
              const response = await fetch('/api/status');
              const data = await response.json();
              // Update UI with new status
              // TODO: Implement status update logic
            } catch (error) {
              console.error('Error fetching status:', error);
            }
          }, 5000);
        </script>
      </body>
    </html>
  `;
}

(async function main() {
  try {
    const docker = createDockerManager();
    batchManager = createBatchManager(docker);
    await batchManager.initialize();

    // Start the main server
    const app = new Koa();
    app.use(async (ctx) => {
      ctx.body = createHtml(batchManager.getCurrentBatch());
    });
    app.listen(args.port);

    // Start the management server
    managementApp.listen(3001);

    showWelcome();

    async function beforeExit() {
      const currentBatch = batchManager.getCurrentBatch();
      if (currentBatch) {
        await docker.stop(currentBatch.services);
      }
    }

    //Ideally we should call beforeExit() before the process exit has actually been called
    //but this is a last resort to make sure that everything has actually been cleaned up
    //so we don't leave dangling containers in case of an atypical exit.
    process.on('exit', async () => {
      await beforeExit();
    });

    process.on('SIGINT', () => process.exit());
    process.on('SIGTERM', () => process.exit());

    await batchManager.getNextBatch();

    const repl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '⫸⫷ '
    });

    console.log('Type "help" for available commands\n');

    repl.on('line', async cmd => {
      try {
        switch (cmd.trim().toLowerCase()) {
          case 'next':
            const next = await batchManager.getNextBatch();
            console.log(next ?
              `Activated batch: ${next.profile} group ${next.chunkIndex + 1}` :
              'No more batches available'
            );
            break;

          case 'previous':
            const prev = await batchManager.getPreviousBatch();
            console.log(prev ?
              `Reverted to: ${prev.profile} group ${prev.chunkIndex + 1}` :
              'No previous batch available'
            );
            break;

          case 'stop':
            await batchManager.stopCurrentBatch();
            console.log('Stopped current batch containers');
            break;

          case 'start':
            await batchManager.startCurrentBatch();
            console.log('Started current batch containers');
            break;

          case 'restart':
            await batchManager.restartCurrentBatch();
            console.log('Restarted current batch containers');
            break;

          case 'status':
            const current = batchManager.getCurrentBatch();
            console.log(current ?
              `Active: ${current.services.join(', ')}` :
              'No active batch'
            );
            break;

          case 'help':
            console.log(`
              Available commands:
              next      - Activate next batch
              previous  - Return to previous batch
              stop      - Stop current batch
              start     - Start current batch
              restart   - Restart current batch
              status    - Show current status
              help      - Show this help
              quit/exit - Exit application
            `);
            break;

          case 'exit': case 'quit':
            await beforeExit();
            process.exit();

          default:
            console.log('Invalid command - type "help" for available commands');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
      repl.prompt();
    });

    repl.prompt();
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
})();
