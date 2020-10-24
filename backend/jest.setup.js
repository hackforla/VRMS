jest.setTimeout(30000)

jest.mock('./workers/openCheckins');
jest.mock('./workers/closeCheckins');
jest.mock('./workers/createRecurringEvents');
jest.mock('./workers/slackbot');
