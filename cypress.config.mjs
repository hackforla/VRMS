import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3003',
    specPattern: 'cypress/integration/**/*.js',
    supportFile: 'cypress/support/index.js',
  },
});
