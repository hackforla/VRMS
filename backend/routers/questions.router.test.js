import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../models/question.model.js');

import { Question } from '../models/index.js';
import questionsRouter from './questions.router.js';
import express from 'express';
import supertest from 'supertest';

const testapp = express();
testapp.use(express.json());
testapp.use(express.urlencoded({ extended: false }));
testapp.use('/api/questions/', questionsRouter);
const request = supertest(testapp);

describe('Unit tests for questions router', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('READ', () => {
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
      Question.find.mockResolvedValue(mockQuestions);

      const response = await request.get('/api/questions');

      expect(Question.find).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);
    });

    it('should return 400 status code when there is an error with GET /api/questions', async () => {
      const error = new Error('Database error');
      Question.find.mockRejectedValue(error);

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get('/api/questions');

      expect(Question.find).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      consoleLogSpy.mockRestore();
    });

    it('should return a specific question with GET /api/questions/:id', async () => {
      const mockQuestion = mockQuestions[0];
      const { id } = mockQuestion;
      Question.findById.mockResolvedValue(mockQuestion);

      const response = await request.get(`/api/questions/${id}`);

      expect(Question.findById).toHaveBeenCalledWith(`${id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestion);
    });

    it('should return 400 status code when there is an error with GET /api/questions/:id', async () => {
      const id = mockQuestions[0].id;
      const error = new Error('Database error');
      Question.findById.mockRejectedValue(error);

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.get(`/api/questions/${id}`);

      expect(Question.findById).toHaveBeenCalledWith(`${id}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      consoleLogSpy.mockRestore();
    });
  });

  describe('CREATE', () => {
    it('should create a new question with POST /api/questions/', async () => {
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

      const response = await request.post('/api/questions/').send(newQuestion);

      expect(Question.create).toHaveBeenCalledWith(newQuestion);
      expect(response.status).toBe(201);
    });

    it('should return 400 status code when there is an error with POST /api/questions', async () => {
      const error = new Error('Database error');
      Question.create.mockRejectedValue(error);

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const response = await request.post('/api/questions');

      expect(Question.create).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(response.status).toBe(400);

      consoleLogSpy.mockRestore();
    });
  });
});
