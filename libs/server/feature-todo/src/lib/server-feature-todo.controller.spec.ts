import { ToDoEntitySchema } from '@fst/server/data-access';
import { repositoryMockFactory } from '@fst/server/util';
import { createMockTodo, createMockUser } from '@fst/shared/util-testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerFeatureTodoController } from './server-feature-todo.controller';
import { ServerFeatureTodoService } from './server-feature-todo.service';

const mockUser = createMockUser();

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
    jest
      .spyOn(service, 'getAll')
      .mockReturnValue(
        Promise.resolve(
          Array.from({ length: 5 }).map(() => createMockTodo(mockUser.id))
        )
      );

    const res = await controller.getAll();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(5);
  });

  it('should return a single todo by ID', async () => {
    const todo = createMockTodo(mockUser.id);
    jest.spyOn(service, 'getOne').mockReturnValue(Promise.resolve(todo));
    expect(await controller.getOne(todo.id)).toStrictEqual(todo);
  });

  it('should be able to create a new todo', async () => {
    const todo = createMockTodo(mockUser.id);
    jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(todo));
    const res = await controller.create({ ...todo });
    expect(res).toStrictEqual(todo);
  });

  it('should allow upserting a new todo', async () => {
    const todo = createMockTodo(mockUser.id);
    jest.spyOn(service, 'upsert').mockReturnValue(Promise.resolve(todo));
    const res = await controller.upsertOne(todo);
    expect(res).toStrictEqual(todo);
  });

  it('should allow updates to a single todo', async () => {
    const todo = createMockTodo(mockUser.id);
    const newTitle = 'newTitle';
    jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve({ ...todo, title: newTitle }));
    const updated = await controller.update(todo.id, { title: newTitle });
    expect(updated.title).toBe(newTitle);
  });

  it('should delete a todo', async () => {
    jest.spyOn(service, 'delete').mockReturnValue(Promise.resolve());
    expect(await controller.delete('')).toBe(undefined);
  });
});
