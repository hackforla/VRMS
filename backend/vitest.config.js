import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./jest.setup.js'],
    testTimeout: 30000,
    globals: false,
    watchExclude: ['**/globalConfig**'],
  },
});
