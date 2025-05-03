// Mock and import Question model
jest.mock('../models/question.model');
const { Question } = require('../models');

// Import question router
const questionsRouter = require('./questions.router');

// Create a test app with Express 
const express = require('express');
const supertest = require('supertest');
const testapp = express();
// Allow for body parsing in test
testapp.use(express.json());
testapp.use('/api/questions/', questionsRouter);
const request = supertest(testapp);

describe('Unit tests for questions router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('READ', () => {
    // Mock question data
    const mockQuestions = [
      {
        id: 1,
        questionText: 'What is your favorite color?',
        htmlName: 'favoriteColor',
        answers: {
          answerOneText: 'Red',
          answerTwoText: 'Blue',
          answerThreeText: 'Green',
          answerFourText: 'Yellow',
        },
      },
      {
        id: 2,
        questionText: 'What is your favorite food?',
        htmlName: 'favoriteFood',
        answers: {
          answerOneText: 'Pizza',
          answerTwoText: 'Cheeseburger',
          answerThreeText: 'Sushi',
          answerFourText: 'Chicken',
        },
      },
    ];

    it('should return all questions with GET /api/questions', async (done) => {
      // Mock the Question.find() method
      Question.find.mockResolvedValue(mockQuestions);

      // Mock the request to the API
      const response = await request.get('/api/questions');

      // Tests
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);

      // Marks completion of tests
      done();
    });

    it('should return a specific question with GET /api/questions/:id', async (done) => {
      // Mock the Question.findById() method
      const questionId = 1;
      Question.findById.mockResolvedValue(mockQuestions[0]);
      // Mock the request to the API
      const response = await request.get(`/api/questions/${questionId}`);
      // Tests
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions[0]);

      // Marks completion of tests
      done();
    });
  });

  describe('CREATE', () => {
    it('should create a new question with POST /api/questions/', async (done) => {
      // Mock the Question.create() method
      const newQuestion = {
        id: 3,
        questionText: 'What is your favorite animal?',
        htmlName: 'favoriteAnimal',
        answers: {
          answerOneText: 'Dog',
          answerTwoText: 'Cat',
          answerThreeText: 'Bird',
          answerFourText: 'Fish',
        },
      };

      Question.create.mockResolvedValue(newQuestion);

      // Mock the request to the API
      const response = await request.post('/api/questions/').send(newQuestion);

      // Tests
      expect(Question.create).toHaveBeenCalledWith(newQuestion);
      expect(response.status).toBe(201);

      // Marks completion of tests
      done();
    });
  });
});
