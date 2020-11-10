# Volunteer Relationship Management System

[VRMS](https://www.vrms.io/) is a tool used for the engagement, support, and retention of a network of volunteers.

This project aims to help us increase engagement, descrease the time needed to onboard to projects, and improve outcomes for both volunteers and the projects they contribute to.

## Technologies

This is a Full Stack web app, built with:

- [React](https://reactjs.org/docs/getting-started.html)
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/en/starter/installing.html)
- [MongoDB](https://docs.mongodb.com/manual/tutorial/getting-started/)
- [Docker](https://www.docker.com/get-started)
- [Github Actions](https://github.com/features/actions)
- [AWS](https://aws.amazon.com/)
- [Redux](https://redux.js.org/introduction/getting-started)
- [Sass](https://sass-lang.com/guide)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

## Contributing

To learn more about contributing, review the https://www.hackforla.org/getting-started guide, join the VRMS team, and review the [Contributing Guide](./CONTRUBTING.md).

## Get up and running

1. Have node installed `node -v`.

1. Have docker running `docker --version`.

1. Add the environment variables for the project.

   - `touch vrms/backend/.env`
   - `touch vrms/client/.env`
   - `touch vrms/client-mvp-04/.env`
   - Then paste the content from the [document](https://docs.google.com/document/d/1yDF6UmyO-MPNrl3y_Mw0mkm_WaixlSkXzWbudCzHXDY/edit?usp=sharing). It is accessible for the project team members only.
   - _Please note that the `ports` for the frontend and backend are set in this location_

1. Run `docker-compose build`.

1. Run `docker-compose up`.

## Running Tests

1. Run the client tests with `docker-compose run --rm client yarn run test`.

1. Run the backend tests with `docker-compose run --rm backend yarn run test`.

1. Run the client-mvp tests with `docker-compose run --rm client-mvp-04 npm run test`.

## Configure your database

The application uses MongoDB different databases dependending on the environment. Below are instructions on how to connect to the different databases used for development.

### Shared Development DB:

The shared development environment database is maintained by the team. Post in the #vrms-dev channel to see who has access if you have any issues.

1. Navigate to the [Get up and running](#get-up-and-running) section and find the credentials link.

1. Add the mongoDB credential listed in the `DATABASE_URL` variable to your `backend/.env` file.

1. The environment variable should start with `mongodb+srv://editor:SHARED_DB_URL`.

### Local DB using Docker:

You can setup a local copy of the database. For a more in depth on how to do this, see the [tutorial](https://zellwk.com/blog/local-mongodb/).

1.  Download mongoDB.

1.  Setup a local mongoDB cluster.

1.  Create a backup of the development DB with `utils/local_db_backup.sh`.

1.  Add your localhost connection string to the `DATABASE_URL` variable to your `backend/.env` file. Your environment variable should start with `mongodb://host.docker.internal:27017/YOUR_DB_NAME`.

### Licensing _WIP_

Details about the project's open source status below:
