# Backend

## Running Tests

To maintain consistency across the front end and back end development, we are using Jest
as a test runner. 

### Execute Tests

You will need to be in the backend directory for this to work.

1. Run all tests: `npm test`
1. Run a single test: `npm test <testFileName>`

### Writing Tests

To maintain idempotent tests, we have opted to use in memory test databases. Jest, like
most test runners, has hooks or methods for you to call before or after tests. We can 
call the `beforeAll` and `afterAll` methods setup and tear down our database before each
test. 

    ```js
    // You will need to require the db-handler file.
    const dbHandler = require("./db-handler");

    // Call the dbHanlder methods in your beforeAll and afterAll methods.
    beforeAll(async () => await dbHandler.connect());
    afterAll(async () => await dbHandler.closeDatabase());
    ```

In addition to hooks to call after the file is completed, Jest also has hooks/methods to
call before and after each test case. **At this time, the `dbHandler` method for clearing
the database does not work, so you can remove each collection manually if needed. 

    ```js
    // You will need to require the db-handler file.
    const dbHandler = require("./db-handler");

    // You will need to get the Model.
    const Event = require("../models/event.model.js");

    // Then you can delete the Collection in the db beforeAll or afterAll.
    afterEach(async () => await Event.remove({}));
    ```

### Unit Tests

Unit tests are tests to write around a single unit. These can be tests around validation 
of a Model, or testing the boundaries on a class. 

### Integration Tests

Integration Tests are tests that verify that differing components work together. A common
example of an integration test is to verify that data is saved correctly in the database
based on the use of the API. 