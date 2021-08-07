// Be able to use Env variables in Github Actions
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand(myEnv);


jest.setTimeout(30000)

// TODO: Refactor worker routes. These are setup to run cron jobs every time the app
// is instantiated. These break any integration tests. 
jest.mock('./workers/openCheckins');
jest.mock('./workers/closeCheckins');
jest.mock('./workers/createRecurringEvents');
jest.mock('./workers/slackbot');
