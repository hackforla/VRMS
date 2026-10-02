import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve as resolvePath } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// shared/ lives at the repo root, one level above client/, and is imported by
// both tiers. Aliased so client imports don't depend on how deeply a file is
// nested (previously ../../../shared vs ../../../../shared).
const repoRoot = resolvePath(__dirname, '..');
const sharedDir = resolvePath(repoRoot, 'shared');

export default defineConfig(({ mode }) => {
  // Load env file based on`mode in the current working directory.
  const env = loadEnv(mode, __dirname, '');
  return {
    plugins: [svgr(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@shared': sharedDir,
      },
    },
    server: {
      port: env.CLIENT_PORT,
      host: true,
      // shared/ is outside the Vite root (client/), so the dev server needs
      // explicit permission to serve it.
      fs: {
        allow: [repoRoot],
      },
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
