import { vi } from 'vitest';

import './env.bootstrap.js';

// TODO: Refactor worker routes. These are setup to run cron jobs every time the app
// is instantiated. These break any integration tests.
vi.mock('./workers/openCheckins.ts');
vi.mock('./workers/closeCheckins.ts');
vi.mock('./workers/createRecurringEvents.js');
vi.mock('./workers/slackbot.js');
