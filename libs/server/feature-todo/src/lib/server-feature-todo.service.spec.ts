import { ToDoEntitySchema } from '@fst/server/data-access-todo';
import { ITodo } from '@fst/shared/domain';
import { createMockTodo } from '@fst/shared/util-testing';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerFeatureTodoService } from './server-feature-todo.service';

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

describe('ServerFeatureTodoService', () => {
  let service: ServerFeatureTodoService;
  let repoMock: MockType<Repository<ITodo>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureTodoService,
        {
          provide: getRepositoryToken(ToDoEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(ServerFeatureTodoService);
    repoMock = module.get(getRepositoryToken(ToDoEntitySchema));
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of to-do items', async () => {
    const todos = Array.from({ length: 5 }).map(() => createMockTodo());
    repoMock.find?.mockReturnValue(todos);
    expect((await service.getAll()).length).toBe(todos.length);
    expect(repoMock.find).toHaveBeenCalled();
  });

  it('should return an a single todo by ID', async () => {
    const todos = Array.from({ length: 5 }).map(() => createMockTodo());
    repoMock.findOneBy?.mockReturnValue(todos[0]);
    expect(await service.getOne(todos[0].id)).toStrictEqual(todos[0]);
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: todos[0].id });
  });

  it('should throw an exception when a todo ID is not found', async () => {
    repoMock.findOneBy?.mockReturnValue(undefined);
    try {
      await service.getOne('foo');
    } catch (err) {
      expect(err instanceof NotFoundException).toBe(true);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 'foo' });
    }
  });

  it('should create a todo', async () => {
    const todo = createMockTodo();
    repoMock.save?.mockReturnValue(todo);
    expect(await service.create(todo)).toStrictEqual(todo);
    expect(repoMock.save).toHaveBeenCalledWith(todo);
  });

  it('should update a todo', async () => {
    const todo = createMockTodo();
    const newTitle = 'foo';
    repoMock.findOneOrFail?.mockReturnValue({ ...todo, title: newTitle });
    const res = await service.update(todo.id, { title: newTitle });
    expect(res.title).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith({
      id: todo.id,
      title: newTitle,
    });
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it('should upsert a todo', async () => {
    const todo = createMockTodo();
    const newTitle = 'foo';
    repoMock.findOneOrFail?.mockReturnValue({ ...todo, title: newTitle });
    const res = await service.upsert(todo);
    expect(res.title).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith(todo);
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it('should delete a todo', async () => {
    repoMock.delete?.mockReturnValue('foo');
    expect(await service.delete('foo')).toBeUndefined();
    expect(repoMock.delete).toHaveBeenCalledWith({ id: 'foo' });
  });
});
