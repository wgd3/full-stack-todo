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
import { createMockTodo } from '@fst/shared/util-testing';
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
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { randEmail, randUuid } from '@ngneat/falso';
import Joi from 'joi';
import * as request from 'supertest';

import { Repository } from 'typeorm';

describe('ServerFeatureTodoController E2E', () => {
  const baseUrl = `/api/v1`;
  const todoUrl = `/todos`;
  const userUrl = `/users`;
  const authUrl = `/auth`;

  const USER_EMAIL = randEmail();
  const USER_UNHASHED_PASSWORD = `Password1!`;

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
      .send({ email: USER_EMAIL, password: USER_UNHASHED_PASSWORD })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
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

  describe('GET /todos', () => {
    it('should return an array of todo items', () => {
      return request
        .default(app.getHttpServer())
        .get(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect((res) => {
          return Array.isArray(res.body);
        });
    });

    it('should not return an array of todo items without auth', () => {
      return request
        .default(app.getHttpServer())
        .get(`${baseUrl}${todoUrl}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect('Content-Type', /json/);
    });
  });

  describe('POST /todos', () => {
    it('should create a todo item', () => {
      const { title, description } = createMockTodo(createdUser.id);
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ title, description })
        .expect('Content-Type', /json/)
        .expect((resp) => {
          const newTodo = resp.body as ITodo;
          expect(newTodo.title).toEqual(title);
          expect(newTodo.description).toEqual(description);
          expect(typeof newTodo.completed).toEqual('boolean');
          expect(typeof newTodo.id).toEqual('string');
        })
        .expect(HttpStatus.CREATED);
    });

    it('should prevent adding a to-do with an ID', () => {
      const { id, title, description } = createMockTodo(createdUser.id);

      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ id, title, description })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property id must not exist'
            )
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should prevent adding a to-do with an existing title', async () => {
      const newTodo = createMockTodo(createdUser.id);
      await todoRepo.save({
        title: newTodo.title,
        description: newTodo.description,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({
          title: newTodo.title,
          description: newTodo.description,
          user: {
            id: createdUser.id,
          },
        })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === `Value for 'todo.title' already exists, try again`
            )
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should prevent adding a todo item with a completed status', () => {
      const { title, description, completed } = createMockTodo(createdUser.id);
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({
          title,
          description,
          completed,
        })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property completed must not exist'
            )
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for title', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ title: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'title must be a string')
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for description', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ description: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'description must be a string'
            )
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce a required title', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ description: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'title should not be empty')
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should require an access token to create', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${todoUrl}`)
        .send({ title: 'foo', description: 'bar' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /todos', () => {
    it('should successfully patch a todo', async () => {
      const { title, description } = createMockTodo(createdUser.id);
      const updatedTitle = 'fooo';
      const originalTodo = await todoRepo.save({
        title,
        description,
        user: {
          id: createdUser.id,
        },
      });

      const url = `${baseUrl}${todoUrl}/${originalTodo.id}`;
      return request
        .default(app.getHttpServer())
        .patch(url)
        .auth(access_token, { type: 'bearer' })
        .send({ title: updatedTitle, completed: true })
        .expect('Content-Type', /json/)
        .expect((resp) => {
          const newTodo = resp.body as ITodo;
          expect(newTodo.title).toEqual(updatedTitle);
          expect(newTodo.description).toEqual(description);
          expect(newTodo.completed).toEqual(true);
          expect(typeof newTodo.completed).toEqual('boolean');
          expect(typeof newTodo.id).toEqual('string');
        })
        .expect(HttpStatus.OK);
    });

    it('should return a 404 for a non-existent todo', async () => {
      const url = `${baseUrl}${todoUrl}/${randUuid()}`;
      return request
        .default(app.getHttpServer())
        .patch(url)
        .auth(access_token, { type: 'bearer' })
        .send({ title: 'foo' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return a 404 for a todo that doesn't belong to the user", async () => {
      const altUser = await userRepo.save({
        email: 'foo@bar.com',
        password: 'Password1!',
      });
      const altUserTodo = await todoRepo.save({
        title: 'foo',
        description: 'bar',
        user: {
          id: altUser.id,
        },
      });
      const url = `${baseUrl}${todoUrl}/${altUserTodo.id}`;
      return request
        .default(app.getHttpServer())
        .patch(url)
        .auth(access_token, { type: 'bearer' })
        .send({ title: 'foo' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should prevent updating a to-do with an ID', async () => {
      const { id, title, description } = createMockTodo(createdUser.id);
      const newTodo = await todoRepo.save({
        title,
        description,
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${todoUrl}/${newTodo.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ id, title, description })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property id must not exist'
            )
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for title', async () => {
      const { id, title, description } = createMockTodo(createdUser.id);
      const newTodo = await todoRepo.save({
        title,
        description,
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${todoUrl}/${newTodo.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ title: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'title must be a string')
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for description', async () => {
      const { id, title, description } = createMockTodo(createdUser.id);
      const newTodo = await todoRepo.save({
        title,
        description,
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${todoUrl}/${newTodo.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ description: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'description must be a string'
            )
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce boolean for completed', async () => {
      const { id, title, description } = createMockTodo(createdUser.id);
      const newTodo = await todoRepo.save({
        title,
        description,
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${todoUrl}/${newTodo.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ completed: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'completed must be a boolean'
            )
          );
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  // afterEach(async () => {
  //   await todoRepo.query('DELETE FROM todo');
  // });
});
