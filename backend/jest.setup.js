// Be able to use Env variables in Github Actions
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand(myEnv);


jest.setTimeout(30000)

// TODO: Refactor worker routes. These are setup to run cron jobs every time the app
// is instantiated. These break any integration tests. 
jest.mock('./src/workers/openCheckins');
jest.mock('./src/workers/closeCheckins');
jest.mock('./src/workers/createRecurringEvents');
jest.mock('./src/workers/slackbot');
