const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);

const { setupDB } = require("../setup-test");
setupDB("api-events");

const { Event } = require('../models');


// API Tests
describe('CREATE', () => {
  test('Create Event', async (done) => {
    // Test Data
    const submittedData = {
      name: 'eventName',
    };

    // Submit an event
    const res = await request
      .post('/api/events/')
      .set('Accept', 'application/json')
      .send(submittedData);
    expect(res.status).toBe(201);

    // Retrieve that event
    const databaseEventQuery = await Event.find();
    const databaseEvent = databaseEventQuery[0];
    expect(databaseEvent.length >= 1);
    expect(databaseEvent.name === submittedData.name);
    done();
  });
});

describe('READ', () => {
  test('GET Events list', async (done) => {
    // Test Data
    const submittedData = {
      createdDate: '2020-05-20T21:16:44.498Z',
      checkinReady: true,
    };

    // Add an event with a project using the API.
    const res = await request.post('/api/events/').send(submittedData);

    // Retrieve and compare the the Event values using the DB.
    const databaseEventQuery = await Event.find();
    const databaseEvent = databaseEventQuery[0];
    expect(databaseEvent.length >= 1);
    expect(databaseEvent.createdDate === submittedData.createdDate);

    // Retrieve and compare the the values using the API.
    const response = await request.get('/api/events/');
    expect(response.statusCode).toBe(200);
    const APIData = response.body[0];
    expect(APIData.createdDate === submittedData.createdDate);
    done();
  });
  test('GET Event by ID', async (done) => {
    // Test Data
    const submittedData = {
      name: 'eventName',
      location: {
        // should we include address here?
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
      },
      hacknight: 'Online', // DTLA, Westside, South LA, Online
      eventType: 'Workshop', // Project Meeting, Orientation, Workshop
      description: 'A workshop to do stuff',
      date: 1594023390039,
      startTime: 1594023390039, // start date and time of the event
      endTime: 1594023390039, // end date and time of the event
      hours: 2, // length of the event in hours
      createdDate: 1594023390039, // date/time event was created
      updatedDate: 1594023390039, // date/time event was last updated
      checkInReady: false, // is the event open for check-ins?
      owner: {
        ownerId: 33, // id of user who created event
      },
    };

    // Create Event by DB
    const dbCreatedevent = await Event.create(submittedData);
    const dbCreatedeventId = dbCreatedevent.id;
    const dbCreatedEventIdURL = `/api/events/${dbCreatedeventId}`;

    // Retrieve and compare the the values using the API.
    const response = await request.get(dbCreatedEventIdURL);
    expect(response.statusCode).toBe(200);
    const apiRetrievedEvent = await response.body;
    expect(apiRetrievedEvent._id).toEqual(dbCreatedeventId);

    done();
  });
});

describe('UPDATE', () => {
  test('Update Event by ID with PATCH', async (done) => {
    // Test Data
    const submittedData = {
      name: 'originalEventName',
    };

    // Submit an event
    const res = await request
      .post('/api/events/')
      .set('Accept', 'application/json')
      .send(submittedData);
    expect(res.status).toBe(201);

    const updatedDataPayload = {
      name: 'updateEventName',
    };

    // Update the event
    const res2 = await request
      .patch(`/api/events/${res.body._id}`)
      .set('Accept', 'application/json')
      .send(updatedDataPayload);
    expect(res2.status).toBe(200);

    done();
  });
});

describe('DELETE', () => {
  test('Delete Event by ID with DELETE', async (done) => {
    // Test Data
    const submittedData = {
      name: 'eventName',
    };

    // Submit an event
    const res = await request
      .post('/api/events/')
      .set('Accept', 'application/json')
      .send(submittedData);
    expect(res.status).toBe(201);

    // Delete the event
    const res2 = await request.delete(`/api/events/${res.body._id}/`);
    expect(res2.status).toBe(200);

    done();
  });
});
