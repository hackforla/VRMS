// Mock and import Question model, import question router
jest.mock('../models/question.model');
const { Question } = require('../models');
const questionsRouter = require('./questions.router');

// Create a test app with Express
const express = require('express');
const supertest = require('supertest');
const testapp = express();
// Allow for body parsing of JSON data
testapp.use(express.json());
// Allow for body parsing of HTML data
testapp.use(express.urlencoded({ extended: false }));
testapp.use('/api/questions/', questionsRouter);
const request = supertest(testapp);

describe('Unit tests for questions router', () => {
  // Clear all mocks after each test
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

    it('should return all questions with GET /api/questions', async () => {
      // Mock the Question.find() method
      Question.find.mockResolvedValue(mockQuestions);

      // Mock the request to the API
      const response = await request.get('/api/questions');

      // Tests
      expect(Question.find).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);

      // Marks completion of tests
    });

    it('should return 400 status code when there is an error with GET /api/questions', async () => {
      // Mock the error thrown when find method is called
      const error = new Error('Database error');
      Question.find.mockRejectedValue(error);

      // Mock console log function
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Mock the request to the API
      const response = await request.get('/api/questions');

      // Tests
      expect(Question.find).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      // Clean up and restores original console log function
      consoleLogSpy.mockRestore();
      // Marks completion of tests
    });

    it('should return a specific question with GET /api/questions/:id', async () => {
      // Mock the Question.findById() method
      const mockQuestion = mockQuestions[0];
      const { id } = mockQuestion;
      Question.findById.mockResolvedValue(mockQuestion);

      // Mock the request to the API
      const response = await request.get(`/api/questions/${id}`);

      // Tests
      expect(Question.findById).toHaveBeenCalledWith(`${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestion);

      // Marks completion of tests
    });

    it('should return 400 status code when there is an error with GET /api/questions/:id', async () => {
      // Mock user id
      const id = mockQuestions[0].id;

      // Mock the error when findById method is called
      const error = new Error('Database error');
      Question.findById.mockRejectedValue(error);

      // Mock console log function
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Mock the request to the API
      const response = await request.get(`/api/questions/${id}`);

      // Tests
      expect(Question.findById).toHaveBeenCalledWith(`${id}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      // Clean up and restores original console log function
      consoleLogSpy.mockRestore();
      // Marks completion of tests
    });
  });

  describe('CREATE', () => {
    it('should create a new question with POST /api/questions/', async () => {
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

      // Mock Question.create method
      Question.create.mockResolvedValue(newQuestion);

      // Mock the request to the API
      const response = await request.post('/api/questions/').send(newQuestion);

      // Tests
      expect(Question.create).toHaveBeenCalledWith(newQuestion);
      expect(response.status).toBe(201);

      // Marks completion of tests
    });

    it('should return 400 status code when there is an error with POST /api/questions', async () => {
      // Mock the error thrown when create method is called
      const error = new Error('Database error');
      Question.create.mockRejectedValue(error);

      // Mock console log function
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Mock the request to the API
      const response = await request.post('/api/questions');

      // Tests
      expect(Question.create).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      // Clean up and restores original console log function
      consoleLogSpy.mockRestore();
      // Marks completion of tests
    });
  });
});
