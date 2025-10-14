/* eslint-disable no-unused-vars */
const cron = require('node-cron');
const fetch = require('node-fetch');

// WORKERS
const runOpenCheckinWorker = require('./workers/openCheckins')(cron, fetch);
const runCloseCheckinWorker = require('./workers/closeCheckins')(cron, fetch);

const { createRecurringEvents } = require('./workers/createRecurringEvents');
const runCreateRecurringEventsWorker = createRecurringEvents(cron, fetch);
