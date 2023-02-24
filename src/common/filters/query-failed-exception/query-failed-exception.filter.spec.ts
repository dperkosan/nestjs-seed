import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryFailedError } from 'typeorm';

import { QueryFailedExceptionFilter } from './query-failed-exception.filter';

describe('QueryFailedExceptionFilter', () => {
  let filter: QueryFailedExceptionFilter<QueryFailedError>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryFailedExceptionFilter<QueryFailedError>],
    }).compile();

    filter = module.get<QueryFailedExceptionFilter<QueryFailedError>>(
      QueryFailedExceptionFilter,
    );
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should catch and handle a QueryFailedError', () => {
      const mockException = new QueryFailedError(
        'SELECT * FROM users',
        [],
        new Error('Connection refused'),
      );

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const mockHost = {
        switchToHttp: () => ({
          getResponse: () => mockResponse,
        }),
      } as ArgumentsHost;

      filter.catch(mockException, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: mockException.driverError.detail,
        errorName: mockException.name,
      });
    });
  });
});
