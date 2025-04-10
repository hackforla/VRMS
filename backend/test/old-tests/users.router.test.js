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
            UserController.create.mockImplementationOnce(
                (req, res) => { return res.status(201).send(mockUser) }
            );
    
            const response = await request
                .post('/api/users/')
                .send(mockUser);
            expect(UserController.create).toHaveBeenCalled();
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
      
    describe('READ', () => {
        it('should get a list of Users with with GET to /api/users/ through UserController', async (done) => {
            UserController.user_list.mockImplementationOnce(
                (req, res) => { return res.status(200).send([mockUser]) }
            );
    
            const response = await request
                .get('/api/users/');
            expect(UserController.user_list).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual(mockUser);

            done();
        });

        it('should get a specific User by param with GET to /api/users?email=<query> through UserController', async (done) => {
            UserController.user_list.mockImplementationOnce(
                (req, res) => { return res.status(200).send([mockUser]) }
            );
    
            const response = await request
                .get('/api/users?email=newtest@test.com');
            expect(UserController.user_list).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body[0]).toEqual(mockUser);

            done();
        });
    
        it('should get a specific User by UserId with GET to /api/users/:UserId through UserController', async (done) => {
            UserController.user_by_id.mockImplementationOnce(
                (req, res) => { return res.status(200).send(mockUser) }
            );
    
            const response = await request
                .get(`/api/users/${mockId}`);
            expect(UserController.user_by_id).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
    
    describe('UPDATE', () => {
        it('should update a User with PATCH to /api/users/:UserId through UserController', async (done) => {
            UserController.update.mockImplementationOnce(
                (req, res) => { return res.status(200).send(mockUser) }
            );
    
            const response = await request
                .patch(`/api/users/${mockId}`)
                .send(mockUpdatedEmail);
            expect(UserController.update).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
    
    describe('DELETE', () => {
        it('should delete a specific user by Id with DELETE /api/users/:UserId through UserController', async (done) => {
            UserController.delete.mockImplementationOnce(
                (req, res) => { return res.status(200).send(mockUser) }
            );
    
            const response = await request
                .delete(`/api/users/${mockId}`)
                .send(mockUpdatedEmail);
            expect(UserController.delete).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);

            done();
        });
    });
});