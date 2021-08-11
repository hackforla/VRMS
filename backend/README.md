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
can setup our db and tear it down by importing the `setupDB` module.

    ```js
    // You will need to require the db-handler file.
    const { setupDB } = require("../setup-test");

    // You will need to name the in memory DB for this test. 
    setupDB("api-auth");
    ```

If you are unsure of where to start, then find a test that does something similar to your
aims. Copy, tweak, and run that test until you have your desired outcome. Also make sure
to give your test it's own name.

### Unit Tests

Unit tests are tests to write around a single unit. These can be tests around validation 
of a Model, or testing the boundaries on a class. 

### Integration Tests

Integration Tests are tests that verify that differing components work together. A common
example of an integration test is to verify that data is saved correctly in the database
based on the use of the API. 