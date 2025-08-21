import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as process from 'node:process';
import { loggerMock } from './mocks/logger';
import { validationPipe } from '../src/global-pipes';
import { AppLogger } from '../src/logger/logger.service';

const TEST_API_KEY = 'test';

const PROFILE_MOCK = {
  displayName: 'John Doe',
  email: 'email@test.com',
  age: 30,
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppLogger)
      .useValue(loggerMock)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(validationPipe);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.API_KEY = TEST_API_KEY;
  });

  afterEach(() => {
    delete process.env.API_KEY;
  });

  describe('/profiles', () => {
    describe('POST', () => {
      it('should throw 401 if no API header is provided', async () => {
        await request(app.getHttpServer())
          .post('/profiles')
          .send(PROFILE_MOCK)
          .expect(401)
          .expect((res) => {
            expect(res.body).toEqual({
              statusCode: 401,
              error: 'Unauthorized',
              message: 'Authorization header missing',
            });
          });
      });

      it('should throw 401 if API key is invalid', async () => {
        await request(app.getHttpServer())
          .post('/profiles')
          .set('Authorization', 'Bearer invalid_key')
          .send(PROFILE_MOCK)
          .expect(401)
          .expect((res) => {
            expect(res.body).toEqual({
              statusCode: 401,
              message: 'Unauthorized',
            });
          });
      });

      it('should return 201 and the created profile', async () => {
        await request(app.getHttpServer())
          .post('/profiles')
          .set('Authorization', `Bearer ${TEST_API_KEY}`)
          .send(PROFILE_MOCK)
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({
              id: expect.any(String),
              ...PROFILE_MOCK,
            });
          });
      });
    });
  });

  describe('logger', () => {
    it('log validation errors', async () => {
      const profile = { displayName: 'John Doe' };

      const EMAIL_ERROR = 'Email must be valid';

      await request(app.getHttpServer())
        .post('/profiles')
        .set('Authorization', `Bearer ${TEST_API_KEY}`)
        .send(profile)
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            statusCode: 400,
            error: 'Bad Request',
            message: [EMAIL_ERROR],
          });
        });

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Validation failed',
        EMAIL_ERROR,
      );
    });
  });
});
