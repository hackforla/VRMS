const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../index');

describe('GET Routes', () => {
    it('should return a JSON array with at least one result and keys: "id", "username", "accessLevel"', () => {
        return supertest(app)
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                const user = res.body[0];

                expect(user).to.include.all.keys('id', 'username', 'accessLevel');
            });
    });

    it('should return a JSON array with at least one results and keys: "id", "eventName", "eventLocation"', () => {
        return supertest(app)
            .get('/api/events')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                const event = res.body[0];
                
                expect(event).to.include.all.keys('id', 'eventName', 'eventLocation');
            });
    });
})



