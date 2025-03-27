import { defineConfig } from 'vite';
import { baseUserConfig } from './vite.config';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseUserConfig,
  mode: 'TESTING',
  base: './',
});
