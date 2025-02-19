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
});

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
    next      - Activate next batch of services
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
      return Object.entries(YAML.parse(content).services)
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



(async function main() {
  try {
    showWelcome();
    const docker = createDockerManager();
    const batchManager = createBatchManager(docker);

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

    await batchManager.initialize();
    await batchManager.getNextBatch();

    const app = new Koa();
    const router = new Router();

    router.get('/', ctx => {
      ctx.type = 'html';
      ctx.body = createHtml(batchManager.getCurrentBatch());
    });

    app.use(router.routes());

    await new Promise((resolve, reject) => {
      app.listen(args.port, () => {
        console.log(`Proof of concept interface is now live at http://localhost:${args.port}`);
        resolve(null);
      }).on('error', reject);
    });

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

function humanizeServiceName(serviceName: string): string {
  return serviceName
    .split('_')
    .map(_.startCase)
    .join(' ');
}
