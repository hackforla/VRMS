const ProjectController = require('./project.controller');

const { setupDB } = require('../setup-test');
setupDB('project-controller');

test('Can import the project controller', async () => {
  expect(ProjectController).not.toBeUndefined();
});
