import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ProfilesModule } from './profiles.module';
import { INestApplication } from '@nestjs/common';
import { validationPipe } from '../global-pipes';
import { LoggerModule } from '../logger/logger.module';
import { AuthGuard } from '../guards/auth.guard';
import { AppLogger } from '../logger/logger.service';
import { loggerMock } from '../../test/mocks/logger';

describe('ProfilesController', () => {
  let app: INestApplication;

  const makeRequest = () => request(app.getHttpServer());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggerModule, ProfilesModule],
    })
      .overrideProvider(AppLogger)
      .useValue(loggerMock)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(validationPipe);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[POST] /profiles', () => {
    it('should return a created profile with valid fields', async () => {
      const createProfileDto = {
        displayName: 'John Doe',
        age: 30,
        email: 'test@email.com',
      };

      const res = await makeRequest()
        .post('/profiles')
        .send(createProfileDto)
        .expect(201);

      expect(res.body).toEqual({
        ...createProfileDto,
        id: expect.stringMatching(/^\d+$/),
      });
    });

    it('should throw an error when creating a profile with invalid email', async () => {
      const invalidEmails = ['', 'invalid-email', 'test@.com', '@test.com'];

      for (const email of invalidEmails) {
        const createProfileDto = {
          displayName: 'Invalid Email',
          age: 25,
          email,
        };

        await makeRequest()
          .post('/profiles')
          .send(createProfileDto)
          .expect(400)
          .expect((res) => {
            expect(res.body).toEqual({
              statusCode: 400,
              message: ['Email must be valid'],
              error: 'Bad Request',
            });
          });
      }
    });
  });
});
