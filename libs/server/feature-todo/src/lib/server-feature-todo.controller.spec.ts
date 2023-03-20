import { ToDoEntitySchema } from '@fst/server/data-access-todo';
import { createMockTodo } from '@fst/shared/util-testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerFeatureTodoController } from './server-feature-todo.controller';
import { ServerFeatureTodoService } from './server-feature-todo.service';
import { repositoryMockFactory } from './server-feature-todo.service.spec';

describe('ServerFeatureTodoController', () => {
  let controller: ServerFeatureTodoController;
  let service: ServerFeatureTodoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureTodoService,
        {
          provide: getRepositoryToken(ToDoEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [ServerFeatureTodoController],
    }).compile();

    controller = module.get(ServerFeatureTodoController);
    service = module.get(ServerFeatureTodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should return an array of to-do items', async () => {
    jest.spyOn(service, 'getAll').mockReturnValue(
      new Promise((res, rej) => {
        res(Array.from({ length: 5 }).map(() => createMockTodo()));
      })
    );
    const res = await controller.getAll();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(5);
  });

  it('should return a single todo by ID', async () => {
    const todo = createMockTodo();
    jest.spyOn(service, 'getOne').mockReturnValue(
      new Promise((res) => {
        res(todo);
      })
    );
    expect(await controller.getOne(todo.id)).toStrictEqual(todo);
  });

  it('should be able to create a new todo', async () => {
    const todo = createMockTodo();
    jest
      .spyOn(service, 'create')
      .mockReturnValue(new Promise((res) => res(todo)));
    const res = await controller.create({ ...todo });
    expect(res).toStrictEqual(todo);
  });

  it('should allow upserting a new todo', async () => {
    const todo = createMockTodo();
    jest
      .spyOn(service, 'upsert')
      .mockReturnValue(new Promise((res) => res(todo)));
    const res = await controller.upsertOne(todo);
    expect(res).toStrictEqual(todo);
  });

  it('should allow updates to a single todo', async () => {
    const todo = createMockTodo();
    const newTitle = 'newTitle';
    jest
      .spyOn(service, 'update')
      .mockReturnValue(new Promise((res) => res({ ...todo, title: newTitle })));
    const updated = await controller.update(todo.id, { title: newTitle });
    expect(updated.title).toBe(newTitle);
  });

  it('should delete a todo', async () => {
    jest.spyOn(service, 'delete').mockReturnValue(new Promise((res) => res()));
    expect(await controller.delete('')).toBe(undefined);
  });
});
