import { ToDoEntitySchema } from '@fst/server/data-access-todo';
import {
  ServerFeatureTodoController,
  ServerFeatureTodoService,
} from '@fst/server/feature-todo';
import { ITodo } from '@fst/shared/domain';
import { createMockTodo } from '@fst/shared/util-testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
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

    xit('should prevent adding a to-do with an ID', () => {
      const todo = createMockTodo();
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send(todo)
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

    xit('should prevent adding a todo item with a completed status', () => {
      const { id, ...todo } = createMockTodo();
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send(todo)
        .expect(HttpStatus.BAD_REQUEST);
    });

    xit('should enforce strings for title', () => {
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ title: 123 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'title must be a string')
          );
        });
    });

    xit('should enforce strings for description', () => {
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ description: false })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'description must be a string'
            )
          );
        });
    });

    xit('should enforce a required title', () => {
      return request
        .default(app.getHttpServer())
        .post(todoUrl)
        .send({ description: false })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'title should not be empty')
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
