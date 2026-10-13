import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach, test } from 'vitest';
import ProjectController from './project.controller.js';

test('Can import the project controller', async () => {
  expect(ProjectController).not.toBeUndefined();
});
