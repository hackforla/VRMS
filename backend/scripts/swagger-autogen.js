const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const packageJson = require('../package.json');

const doc = {
  info: {
    title: 'VRMS API',
    version: packageJson.version,
    description: 'Volunteer Relationship Management System API',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Check-Ins', description: 'Check-in endpoints' },
    { name: 'Events', description: 'Event endpoints' },
    { name: 'Projects', description: 'Project endpoints' },
    { name: 'Questions', description: 'Question endpoints' },
    { name: 'Recurring Events', description: 'Recurring event endpoints' },
    { name: 'Users', description: 'User endpoints' },
    { name: 'Health', description: 'Health check endpoints' },
    { name: 'Permissions', description: 'Permission endpoints' },
    { name: 'Project Team Members', description: 'Project team member endpoints' },
  ],
};

const outputFile = '../swagger-output.json';
const routes = ['../app.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
});
