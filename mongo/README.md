# Summary
This module generates a series of JSON documents that are then treated as seed data for the Mongo database.

It provides an `index.js` script that exposes a command with two parameters:

- **type**: the document type to create
- **amount**: the number of records to create

This command is used to generate test data files that are stored in the `/data` directory.
We generate these files at compile time rather than at runtime to ensure that the same test data is added to all user's environments.

## Workflow for adding a new collection of data

1. Review the [documentation](http://marak.github.io/faker.js/) for the `faker` project.
1. Duplicate the `/scripts/employees.js` file and modify for the new data model.
1. Add the new data model script to the `/scripts/index.js` file.
   - Specify the `type` parameter value to associate with the data model.
1. Add a new script to the `package.json` for generating test data for the new model (e.g. `generate:employees`).
1. Run the newly created script to generate the test data file in the `/data` directory.
1. update the `init.sh` file to load the newly created test data file into the relevant database collection.
1. Run the `npm run rebuild` script defined in the `package.json` file to update the docker image.

## Workflow for updating a collection of data
Do this after regenerating test data using the provided script or via manual entry.

1. Run the `npm run rebuild` script defined in the `package.json` file to update the docker image.

# Other Notes
The included `employees` collection is provided as example of how to generate test data.
It is not specified for use in the VRMS project.

## Source Material

- [faker documentation](http://marak.github.io/faker.js/)
- [MongoDB documentation](https://docs.mongodb.com/database-tools/mongoimport/)
- [Running MongoDB in Docker](https://www.bmc.com/blogs/mongodb-docker-container/)

- [Seeding data for MongoDB](https://valenciandigital.com/blog/seeding-data-into-mongodb-using-docker)