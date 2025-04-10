// Setup mocks for UserController
jest.mock('../controllers/user.controller');
const { UserController } = require('../controllers');

// Must import usersRouter after setting up mocks for UserController
const usersRouter = require('./users.router');
const express = require('express');
const supertest = require('supertest');

// Setup testapp with just usersRouter which calls mocked UserController
const testapp = express();
testapp.use('/api/users', usersRouter);
const request = supertest(testapp);

describe('Unit Tests for userRouter', () => {
    // Mocked user data
    const mockUser = {
        name: {
            firstName: 'test',
            lastName: 'user',
        },
        email: 'newtest@test.com',
    };
    const mockId = '12345';
    const mockUpdatedEmail = {
        email: 'newtest@test.com',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('CREATE', () => {
        it('should create a User through the UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.create.mockImplementationOnce(
                (req, res) => { return res.status(201).send(mockUser) }
            );
    
            //Functionality
            //Post mockUser to CREATE API Endpoint
            const response = await request
                .post('/api/users/')
                .send(mockUser);

            //Test
            expect(UserController.create).toHaveBeenCalled();
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
      
    describe('READ', () => {
        it('should get a list of Users with with GET to /api/users/ through UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.user_list.mockImplementationOnce(
                (req, res) => { return res.status(200).send([mockUser]) }
            );
    
            //Functionality
            //Get list of all users from READ API Endpoint
            const response = await request
                .get('/api/users/');

            //Test
            expect(UserController.user_list).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual(mockUser);

            done();
        });

        it('should get a specific User by param with GET to /api/users?email=<query> through UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.user_list.mockImplementationOnce(
                (req, res) => { return res.status(200).send([mockUser]) }
            );
    
            //Functionality
            //Get a user with a specific email using a query param to READ API Endpoint
            const response = await request
                .get('/api/users?email=newtest@test.com');

            //Test
            expect(UserController.user_list).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual(mockUser);

            done();
        });
    
        it('should get a list of Users with accessLevel of admin or superadmin with GET to /api/users/admins through UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.admin_list.mockImplementationOnce(
                (req, res) => { return res.status(200).send([mockUser]) }
            );
    
            //Functionality
            //Get a list of admins and superadmins from READ API Endpoint for admins
            const response = await request
                .get('/api/users/admins');

            //Test
            expect(UserController.admin_list).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual(mockUser);

            done();
        });
    
        it('should get a list of Users with the ability to manage projects with GET to /api/users/projectManagers through UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.projectLead_list.mockImplementationOnce(
                (req, res) => { return res.status(200).send([mockUser]) }
            );
    
            //Functionality
            //Get a list of project leads and admins from READ API Endpoint for project leads
            const response = await request
                .get('/api/users/projectManagers');

            //Test
            expect(UserController.projectLead_list).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual(mockUser);

            done();
        });
    
        it('should get a specific User by UserId with GET to /api/users/:UserId through UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.user_by_id.mockImplementationOnce(
                (req, res) => { return res.status(200).send(mockUser) }
            );
    
            //Functionality
            //Get a specific user from READ API Endpoint for specific UUIDs
            const response = await request
                .get(`/api/users/${mockId}`);

            //Test
            expect(UserController.user_by_id).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
    
    describe('UPDATE', () => {
        it('should update a User with PATCH to /api/users/:UserId through UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.update.mockImplementationOnce(
                (req, res) => { return res.status(200).send(mockUser) }
            );
    
            //Functionality
            //Patch a user with a specific id by sending new user data to UPDATE API Endpoint
            const response = await request
                .patch(`/api/users/${mockId}`)
                .send(mockUpdatedEmail);

            //Test
            expect(UserController.update).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
    
    describe('DELETE', () => {
        it('should delete a specific user by Id with DELETE /api/users/:UserId through UserController', async (done) => {
            //Setup
            //Mock the UserController function that this route calls with expected results
            UserController.delete.mockImplementationOnce(
                (req, res) => { return res.status(200).send(mockUser) }
            );
    
            //Delete user with a specific id via a request to DELETE API Endpoint
            const response = await request
                .delete(`/api/users/${mockId}`)
                .send(mockUpdatedEmail);

            //Test
            expect(UserController.delete).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
});