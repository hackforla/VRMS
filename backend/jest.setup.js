// Be able to use Env variables in Github Actions
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { vi } from 'vitest';

const myEnv = dotenv.config();
dotenvExpand(myEnv);

// TODO: Refactor worker routes. These are setup to run cron jobs every time the app
// is instantiated. These break any integration tests.
vi.mock('./workers/openCheckins.js');
vi.mock('./workers/closeCheckins.js');
vi.mock('./workers/createRecurringEvents.js');
vi.mock('./workers/slackbot.js');
