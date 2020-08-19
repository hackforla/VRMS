// const { expect } = require('chai');
const {app, runServer, closeServer} = require('../server');
const { TEST_DATABASE_URL, PORT } = require("../config/database");
const supertest = require('supertest');
// const request = supertest(app)

const mongoose = require('mongoose')
const databaseName = 'test'
// test_server = await runServer(TEST_DATABASE_URL, PORT)
// console.log(process.env.DATABASE_URL)

const { MongoMemoryServer } = require('mongodb-memory-server');

const AnswerModel = require("../models/checkIn.model")
const answerData = {
    userId: "1",
    eventId: "23",
    checkedIn: true,
    createdDate: 1594023390039,
};

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;


beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, (err) => {
      if (err) console.error(err);
    });
  });
  
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("should work", () => {
    it('it really hopefuly works', async () => {
      const User = mongoose.model('TestUser', new mongoose.Schema({ name: String }));
      const count = await User.count();
      expect(count).toEqual(0);
    });
  });

// describe("Getting a working tests", () => {
//     beforeAll(done => {
//         test_server = await runServer(TEST_DATABASE_URL, PORT)
//         done()
//       })
      
//     afterAll(done => {
//     // Closing the DB connection allows Jest to exit successfully.
//     mongoose.connection.close()
//     done()
//     })

//     it('Testing to see if Jest works',  (done) => {
//         expect(1).toBe(1)
//         done()
//     })
// })

// const {MongoClient} = require('mongodb');

// describe('insert', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     db = await connection.db();
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it('Testing to see if Jest works',  (done) => {
//     expect(1).toBe(1)
//     done()
//     })

// it('should insert a doc into collection', async () => {
//     const users = db.collection('users');
  
//     const mockUser = {_id: 'some-user-id', name: 'John'};
//     await users.insertOne(mockUser);
  
//     const insertedUser = await users.findOne({_id: 'some-user-id'});
//     expect(insertedUser).toEqual(mockUser);
//   });
// });


// describe(' get a working test ', ()=>{
    

//     beforeAll(async () => {
//         const url = `mongodb://127.0.0.1/${databaseName}`
//         await mongoose.connect(url, { useNewUrlParser: true })
//     })

//     afterAll( async () =>{
//         await mongoose.connection.close()
//     })

//     // beforeAll(async () => {
//     //     await firebase.firestore().enableNetwork();
//     // });

//     // afterAll(async () => {
//     //     await firebase.firestore().disableNetwork();
//     // });

//     it('Testing to see if Jest works', async (done) => {
//         expect(1).toBe(1)
//         done()
//     })

// })

// This test fails because 1 !== 2

// describe('GET Routes', () => {
//     

//     it('should return a JSON array with at least one result and keys: "id", "username", "accessLevel"', () => {
//         return supertest(app)
//             .get('/api/users')
//             .expect(200)
//             .expect('Content-Type', /json/)
//             .then(res => {
//                 expect(res.body).to.be.an('array');
//                 const user = res.body[0];

//                 expect(user).to.include.all.keys('id', 'username', 'accessLevel');
//             });
//     });

//     it('should return a JSON array with at least one results and keys: "id", "eventName", "eventLocation"', () => {
//         return supertest(app)
//             .get('/api/events')
//             .expect(200)
//             .expect('Content-Type', /json/)
//             .then(res => {
//                 expect(res.body).to.be.an('array');
//                 const event = res.body[0];
                
//                 expect(event).to.include.all.keys('id', 'eventName', 'eventLocation');
//             });
//     });
// })



