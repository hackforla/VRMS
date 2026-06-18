import { vi } from 'vitest';

import './env.bootstrap.js';

// TODO: Refactor worker routes. These are setup to run cron jobs every time the app
// is instantiated. These break any integration tests.
vi.mock('./workers/openCheckins.js');
vi.mock('./workers/closeCheckins.js');
vi.mock('./workers/createRecurringEvents.js');
vi.mock('./workers/slackbot.js');
