import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { useSeederFactoryManager } from 'typeorm-extension';

import dataSource from '../../src/database/config/typeorm.config';
import { CreateOrganizationDto } from '../../src/organizations/dto/create-organization.dto';
import { Organization } from '../../src/organizations/entities/organization.entity';
import clearDB from '../../src/utils/clearDB';
import setupTestApp from '../test-app-setup';

describe('Organizations (e2e)', () => {
  let app: INestApplication;
  let requestTest: request.Test;
  const factoryManager = useSeederFactoryManager();
  const organizationFactory = factoryManager.get(Organization);

  beforeAll(async () => {
    app = await setupTestApp(app);
  });

  beforeEach(async () => {
    // clear all data from test DB before every test
    await dataSource.initialize();
    await clearDB(dataSource);
    await dataSource.destroy();
  });

  describe('POST /organizations', () => {
    let createOrganizationDto: CreateOrganizationDto;

    describe('without payload', () => {
      beforeEach(() => {
        requestTest = request(app.getHttpServer()).post('/organizations');
      });

      it('returns a detailed error message', () => {
        return requestTest.expect({
          statusCode: 400,
          message: ['name should not be empty', 'name must be a string'],
          error: 'Bad Request',
        });
      });
    });

    describe('with non whitelisted params', () => {
      beforeEach(() => {
        // casting DTO to be able to bypass TypeScript and send an incorrect DTO
        createOrganizationDto = {
          name: faker.company.name(),
          id: randomUUID(),
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          users: [
            {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
              id: randomUUID(),
              organizationId: randomUUID(),
              createdAt: faker.date.recent(),
              updatedAt: faker.date.recent(),
            },
          ],
        } as unknown as CreateOrganizationDto;

        requestTest = request(app.getHttpServer())
          .post('/organizations')
          .send(createOrganizationDto);
      });

      it('returns a detailed error message', () => {
        return requestTest.expect({
          statusCode: 400,
          message: [
            'property id should not exist',
            'property createdAt should not exist',
            'property updatedAt should not exist',
            'users.0.property id should not exist',
            'users.0.property organizationId should not exist',
            'users.0.property createdAt should not exist',
            'users.0.property updatedAt should not exist',
          ],
          error: 'Bad Request',
        });
      });
    });

    describe('with unknown param', () => {
      beforeEach(() => {
        createOrganizationDto = {
          name: faker.company.name(),
          foo: 'bar',
        } as unknown as CreateOrganizationDto;

        requestTest = request(app.getHttpServer())
          .post('/organizations')
          .send(createOrganizationDto);
      });

      it('returns a detailed error message', () => {
        return requestTest.expect({
          statusCode: 400,
          message: ['property foo should not exist'],
          error: 'Bad Request',
        });
      });
    });

    describe('without userDto in payload', () => {
      beforeEach(() => {
        createOrganizationDto = {
          name: faker.company.name(),
        };

        requestTest = request(app.getHttpServer())
          .post('/organizations')
          .send(createOrganizationDto);
      });

      it('returns created status and created organization', () => {
        return requestTest.expect(({ body, statusCode }) => {
          expect(statusCode).toStrictEqual(201);
          expect(body).toStrictEqual({
            id: expect.any(String),
            name: createOrganizationDto.name,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });
    });

    describe('with userDto in payload', () => {
      beforeEach(() => {
        createOrganizationDto = {
          name: faker.company.name(),
          users: [
            {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
            },
            {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
            },
          ],
        };

        requestTest = request(app.getHttpServer())
          .post('/organizations')
          .send(createOrganizationDto);
      });

      it('returns created status and created organization with created users', () => {
        return requestTest.expect(({ body, statusCode }) => {
          expect(statusCode).toStrictEqual(201);
          expect(body).toStrictEqual({
            id: expect.any(String),
            name: createOrganizationDto.name,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            users: [
              {
                id: expect.any(String),
                organizationId: expect.any(String),
                firstName: createOrganizationDto.users[0].firstName,
                lastName: createOrganizationDto.users[0].lastName,
                email: createOrganizationDto.users[0].email,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                id: expect.any(String),
                organizationId: expect.any(String),
                firstName: createOrganizationDto.users[1].firstName,
                lastName: createOrganizationDto.users[1].lastName,
                email: createOrganizationDto.users[1].email,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
            ],
          });
        });
      });
    });
  });

  describe('GET /organizations', () => {
    let organizations: Organization[];

    beforeEach(async () => {
      organizations = await organizationFactory.saveMany(3);
      console.log(organizations);
    });

    describe('without payload', () => {
      beforeEach(() => {
        requestTest = request(app.getHttpServer()).get('/organizations');
      });

      it('returns an array of organizations', () => {
        return requestTest.expect({
          statusCode: 400,
          message: ['name should not be empty', 'name must be a string'],
          error: 'Bad Request',
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
