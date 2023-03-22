import { ToDoEntitySchema } from '@fst/server/data-access';
import { MockType, repositoryMockFactory } from '@fst/server/util/testing';
import { ITodo } from '@fst/shared/domain';
import { createMockTodo, createMockUser } from '@fst/shared/util-testing';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ServerFeatureTodoService } from './server-feature-todo.service';

const mockUser = createMockUser();

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

  it('should return an array of to-do items for a specific user', async () => {
    const todos = Array.from({ length: 5 }).map(() =>
      createMockTodo(mockUser.id)
    );
    repoMock.find?.mockReturnValue(todos);
    expect((await service.getAll(mockUser.id)).length).toBe(todos.length);
    expect(repoMock.find).toHaveBeenCalled();
  });

  it('should return an a single todo by ID', async () => {
    const todos = Array.from({ length: 5 }).map(() =>
      createMockTodo(mockUser.id)
    );
    repoMock.findOneBy?.mockReturnValue(todos[0]);
    expect(await service.getOne(mockUser.id, todos[0].id)).toStrictEqual(
      todos[0]
    );
    expect(repoMock.findOneBy).toHaveBeenCalledWith({
      id: todos[0].id,
      user_id: mockUser.id,
    });
  });

  it('should throw an exception when a todo ID is not found', async () => {
    repoMock.findOneBy?.mockReturnValue(undefined);
    try {
      await service.getOne(mockUser.id, 'foo');
    } catch (err) {
      expect(err instanceof NotFoundException).toBe(true);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({
        id: 'foo',
        user_id: mockUser.id,
      });
    }
  });

  it('should create a todo', async () => {
    const todo = createMockTodo(mockUser.id);
    repoMock.save?.mockReturnValue(todo);
    expect(await service.create(mockUser.id, todo)).toStrictEqual(todo);
    expect(repoMock.save).toHaveBeenCalledWith(todo);
  });

  it('should catch an error if a duplicate title is detected', async () => {
    const todo = createMockTodo(mockUser.id);
    repoMock.save?.mockImplementation(() => {
      const err = new QueryFailedError('unique constraint failed', [], {});
      err.message =
        'ERROR SQLITE_CONSTRAINT: UNIQUE constraint failed: todo.title';
      throw err;
    });
    try {
      await service.create(mockUser.id, todo);
    } catch (err) {
      expect(err).toBeInstanceOf(QueryFailedError);
    }
  });

  it('should update a todo', async () => {
    const todo = createMockTodo(mockUser.id);
    const newTitle = 'foo';
    repoMock.findOneOrFail?.mockReturnValue({ ...todo, title: newTitle });
    const res = await service.update(mockUser.id, todo.id, { title: newTitle });
    expect(res.title).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith({
      user_id: mockUser.id,
      id: todo.id,
      title: newTitle,
    });
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it("should not update a todo that doesn't exist", async () => {
    repoMock.findOneBy?.mockReturnValue(null);
    try {
      await service.update(mockUser.id, '', {});
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should upsert a todo', async () => {
    const todo = createMockTodo(mockUser.id);
    const newTitle = 'foo';
    repoMock.findOneOrFail?.mockReturnValue({ ...todo, title: newTitle });
    const res = await service.upsert(mockUser.id, todo);
    expect(res.title).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith(todo);
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it('should delete a todo', async () => {
    const todo = createMockTodo(mockUser.id);
    repoMock.findOneBy?.mockReturnValue(todo);
    repoMock.remove?.mockReturnValue(todo);
    expect(await service.delete(mockUser.id, todo.id)).toBeUndefined();
    expect(repoMock.remove).toHaveBeenCalledWith(todo);
  });

  it("should not delete a todo that doesn't exist", async () => {
    repoMock.findOneBy?.mockReturnValue(null);
    try {
      await service.delete(mockUser.id, '');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
