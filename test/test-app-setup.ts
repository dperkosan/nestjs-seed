import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';

import { AppModule } from '../src/app.module';

const setupTestApp = async (app: INestApplication) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  useContainer(app, { fallbackOnErrors: true });
  await app.init();

  return app;
};

export default setupTestApp;
