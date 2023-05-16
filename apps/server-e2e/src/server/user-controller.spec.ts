import { ToDoEntitySchema, UserEntitySchema } from '@fst/server/data-access';
import { ServerFeatureAuthModule } from '@fst/server/feature-auth';
import { ServerFeatureHealthModule } from '@fst/server/feature-health';
import { ServerFeatureTodoModule } from '@fst/server/feature-todo';
import { ServerFeatureUserModule } from '@fst/server/feature-user';
import { DatabaseExceptionFilter, JwtAuthGuard } from '@fst/server/util';
import {
  IPublicUserData,
  ITodo,
  ITokenResponse,
  IUser,
} from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { randEmail, randPassword } from '@ngneat/falso';
import Joi from 'joi';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe('ServerFeatureUserController E2E', () => {
  const baseUrl = `/api/v1`;
  const todoUrl = `/todos`;
  const userUrl = `/users`;
  const authUrl = `/auth/email`;

  const USER_EMAIL = randEmail();
  const USER_UNHASHED_PASSWORD = `Password1!`;
  const MOCK_USER = createMockUser({ email: USER_EMAIL });

  let app: INestApplication;
  let todoRepo: Repository<ITodo>;
  let userRepo: Repository<IUser>;
  let createdUser: IPublicUserData;
  let access_token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ServerFeatureTodoModule,
        ServerFeatureAuthModule,
        ServerFeatureUserModule,
        ServerFeatureHealthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
          ignoreEnvVars: true,
          validationSchema: Joi.object({
            DATABASE_PATH: Joi.string().default(':memory:'),
            DATABASE_LOGGING_ENABLED: Joi.boolean().default(false),
            ENVIRONMENT: Joi.string().default('test'),
            NODE_ENV: Joi.string().default('test'),
            JWT_SECRET: Joi.string().default(randPassword({ size: 32 })),
          }),
        }),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => {
            // make sure this is cast as a boolean
            const logging = !!config.get('DATABASE_LOGGING_ENABLED');
            const database = config.get('DATABASE_PATH');
            return {
              type: 'sqlite',
              database,
              logging,
              synchronize: true,
              autoLoadEntities: true,
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: APP_FILTER,
          useClass: DatabaseExceptionFilter,
        },
      ],
      controllers: [],
    })
      .setLogger(new Logger())
      .compile();

    app = moduleRef.createNestApplication();

    todoRepo = moduleRef.get(getRepositoryToken(ToDoEntitySchema));
    userRepo = moduleRef.get(getRepositoryToken(UserEntitySchema));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    );

    app.setGlobalPrefix('/api');
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
    });

    /////////////////////////////////////////////
    // App Setup (main.ts-related stuff) goes
    // above this line!
    /////////////////////////////////////////////

    await app.init();

    /////////////////////////////////////////////
    // Create a user that can be used for the
    // whole test suite
    /////////////////////////////////////////////
    createdUser = await request
      .default(app.getHttpServer())
      .post(`${baseUrl}${userUrl}`)
      .set('Content-type', 'application/json')
      .send({
        email: USER_EMAIL,
        password: USER_UNHASHED_PASSWORD,
        socialProvider: MOCK_USER.socialProvider,
        socialId: MOCK_USER.socialId,
        givenName: MOCK_USER.givenName,
        familyName: MOCK_USER.familyName,
        profilePicture: MOCK_USER.profilePicture,
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        Logger.debug(
          `Created base user ${res.body.email}`,
          `UserController E2E Spec`
        );
        return res.body as IPublicUserData;
      });

    /////////////////////////////////////////////
    // Create a valid, signed access token to be
    // used with all API calls
    /////////////////////////////////////////////
    access_token = await request
      .default(app.getHttpServer())
      .post(`${baseUrl}${authUrl}/login`)
      .send({ email: USER_EMAIL, password: USER_UNHASHED_PASSWORD })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((resp) => (resp.body as ITokenResponse).access_token);
  });

  describe('GET /users', () => {
    it('should return information about a user', () => {
      return request
        .default(app.getHttpServer())
        .get(`${baseUrl}${userUrl}/${createdUser.id}`)
        .auth(access_token, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });

    it('should not return information about a different user', async () => {
      const user2 = await userRepo.save({
        email: 'foo@bar.com',
        password: 'Password1!',
      });
      return request
        .default(app.getHttpServer())
        .get(`${baseUrl}${userUrl}/${user2.id}`)
        .auth(access_token, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /users', () => {
    it('should update a user', () => {
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${userUrl}/${createdUser.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ email: randEmail() })
        .expect(HttpStatus.OK);
    });

    it('should not update a different user', async () => {
      const user2 = await userRepo.save({
        email: randEmail(),
        password: 'Password1!',
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${userUrl}/${user2.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ email: randEmail() })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should enforce email formats', () => {
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${userUrl}/${createdUser.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ email: 'notanemail' })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'email must be an email')
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce password requirements', () => {
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${userUrl}/${createdUser.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ password: randPassword({ size: 5 }) })

        .expect((resp) => {
          const { message } = resp.body;
          expect((message as string[]).some((m) => m.includes('strong'))).toBe(
            true
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should allow strong passwords', () => {
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${userUrl}/${createdUser.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ password: 'FullStackT0d0!' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.OK);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', () => {
      const { id, todos, ...user } = createMockUser({
        password: 'FullStackT0d0!',
      });
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${userUrl}`)
        .send({ ...user })
        .expect(({ body }) => {
          console.log(`body`, body);
          const { email, id } = body as IPublicUserData;
          expect(email).toEqual(user.email);
          expect(typeof id).toBe('string');
          expect(Object.keys(body).includes('password')).toEqual(false);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED);
    });

    it('should enforce password requirements', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${userUrl}`)
        .send({ email: randEmail(), password: randPassword({ size: 5 }) })
        .expect((resp) => {
          const { message } = resp.body;
          expect((message as string[]).some((m) => m.includes('strong'))).toBe(
            true
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce email format', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${userUrl}`)
        .send({ email: 'notanemail', password: `FullStackT0d0!` })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'email must be an email')
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should prevent duplicate emails', async () => {
      const existingUser = (await userRepo.find({ take: 1 })).pop();
      const { id, todos, ...newUser } = createMockUser({
        email: existingUser.email,
        password: 'FullStackT0d0!',
      });
      const users = await userRepo.find();
      Logger.debug(
        `All users:\n${JSON.stringify(users, null, 2)}`,
        `UserController E2E Spec`
      );
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${userUrl}`)
        .send({ ...newUser })
        .expect((resp) => {
          console.log(`resp`, resp.body);
          const { message } = resp.body;
          // this error does not come back in the form of an array of
          // errors since it's a database error, not a payload
          // validation error
          expect(message.includes('already exists')).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  // afterEach(async () => {
  //   await userRepo.query(
  //     `delete from user where email != '${createdUser.email}'`
  //   );
  // });

  afterAll(async () => {
    await app.close();
  });
});
