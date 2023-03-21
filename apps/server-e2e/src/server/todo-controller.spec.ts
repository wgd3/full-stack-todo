import { ToDoEntitySchema } from '@fst/server/data-access-todo';
import {
  ServerFeatureTodoController,
  ServerFeatureTodoService,
} from '@fst/server/feature-todo';
import { ITodo } from '@fst/shared/domain';
import { createMockTodo } from '@fst/shared/util-testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn(() => ({})),
    save: jest.fn((entity) => entity),
    findOneOrFail: jest.fn(() => ({})),
    delete: jest.fn(() => null),
    find: jest.fn((entities) => entities),
  })
);

describe('ServerFeatureTodoController E2E', () => {
  const todoUrl = `/todos`;
  let app: INestApplication;
  let repoMock: MockType<Repository<ITodo>>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        ServerFeatureTodoService,
        {
          provide: getRepositoryToken(ToDoEntitySchema),
          useFactory: repositoryMockFactory,
        },
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
          }),
        },
      ],
      controllers: [ServerFeatureTodoController],
    }).compile();

    app = moduleRef.createNestApplication();
    repoMock = moduleRef.get(getRepositoryToken(ToDoEntitySchema));

    await app.init();
  });

  describe('GET /todos', () => {
    it('should return an array of todo items', () => {
      return request
        .default(app.getHttpServer())
        .get(todoUrl)
        .expect(HttpStatus.OK);
    });
  });

  describe('POST /todos', () => {
    it('should create a todo item', () => {
      const { id, completed, title, description } = createMockTodo();
      jest
        .spyOn(repoMock, 'save')
        .mockReturnValue(
          Promise.resolve({ id, completed, title, description })
        );
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ title, description })
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
      const { id, title, description } = createMockTodo();
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ id, title, description })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property id must not exist'
            )
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    xit('should prevent adding a to-do with an existing title', () => {
      const todo = createMockTodo();
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send(todo)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should prevent adding a todo item with a completed status', () => {
      const { id, ...todo } = createMockTodo();
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send(todo)
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property should must not exist'
            )
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for title', () => {
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ title: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'title must be a string')
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for description', () => {
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ description: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'description must be a string'
            )
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce a required title', () => {
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ description: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'title should not be empty')
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
