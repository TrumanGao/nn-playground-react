import { defineConfig } from 'vite';
import { baseUserConfig } from './vite.config';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseUserConfig,
  plugins: [
    ...baseUserConfig.plugins,
    basicSsl({
      /** name of certification */
      name: 'test',
      /** custom trust domains */
      domains: ['*.custom.com'],
      /** custom certification directory */
      certDir: './vite/cert',
    }),
  ],
  mode: 'DEVELOPMENT',
  define: {
    __DEVELOPER__: JSON.stringify(process.env.__DEVELOPER__),
  },
  server: {
    open: true,
    host: 'localhost',
    strictPort: true,
    https: true,
    proxy: {
      '^/apiBase/.*': {
        target: 'https://xxx.xx.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiBase/, ''),
      },
    },
  },
});
