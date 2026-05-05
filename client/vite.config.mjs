import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load env file based on`mode in the current working directory.
  const env = loadEnv(mode, __dirname, '');
  return {
    plugins: [svgr(), react(), tailwindcss()],
    server: {
      port: env.CLIENT_PORT,
      host: true,
      proxy: {
        '/api': {
          target: env.REACT_APP_PROXY,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'build',
    },
    test: {
      environment: 'jsdom',
    },
  };
});
