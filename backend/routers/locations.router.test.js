const config = require('../config/auth.config');
const supertest = require('supertest');
const { Location } = require('../models/dictionaries/location.model');
const { setupDB } = require('../setup-test');
const app = require('../app');

const request = supertest(app);
const endpoint = '/api/locations';
const headers = {
    'x-customrequired-header': config.CUSTOM_REQUEST_HEADER,
    'Accept': 'application/json'
};

setupDB('router-location');

const data = ['Los Angeles', 'Santa Monica', 'San Fernando Valley'];
const badDataValidation = [
    {
        test: 'input should be array',
        data: 'Los Angeles'
    },
    {
        test: 'input array should not be empty',
        data: []
    },
    {
        test: 'input array should contain strings',
        data: [1, { location: 'Los Angeles' }]
    },
    {
        test: 'input array should not contain empty strings',
        data: ['Los Angeles', '', 'Santa Monica']
    }
];

describe(`GET ${endpoint}`, () => {
    it('should respond with 200 and return empty array when no locations have been created', async (done) => {
        const res = await request
            .get(`${endpoint}`)
            .set(headers);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
        done();
    })

    it('should respond with 200 and array of previously created locations', async (done) => {
        await request
            .post(`${endpoint}`)
            .set(headers)
            .send({ locations: data });

        const res = await request
            .get(`${endpoint}`)
            .set(headers);

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual(data);
        done();
    });
});

describe(`POST ${endpoint}`, () => {
    it('should respond with 201 on successful operation', async (done) => {
        const res = await request
            .post(`${endpoint}`)
            .set(headers)
            .send({ locations: data });

        expect(res.status).toBe(201);
        done();
    });

    for (const { test, data } of badDataValidation) {
        it(`should respond with 400 for validation error: ${test}`, async (done) => {
            const res = await request
                .post(`${endpoint}`)
                .set(headers)
                .send({ locations: data });

            expect(res.status).toBe(400);
            done();
        });
    }
});
