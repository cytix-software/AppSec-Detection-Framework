import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import yaml from '@modyfi/vite-plugin-yaml';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    yaml()
  ],
  server: {
    fs: {
      allow: [path.resolve('..')]
    }
  },
  resolve: {
    alias: {
      '@data': path.resolve(__dirname, '../')
    }
  }
});
