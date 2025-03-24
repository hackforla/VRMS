import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  // Load env file based on`mode in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      svgr(),
      react(),
    ],
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
