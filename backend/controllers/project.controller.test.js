import ProjectController from './project.controller.js';

import { setupDB } from '../setup-test.js';
setupDB('project-controller');

test('Can import the project controller', async () => {
  expect(ProjectController).not.toBeUndefined();
});
