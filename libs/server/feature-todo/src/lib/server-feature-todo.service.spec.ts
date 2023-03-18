import { ToDoEntitySchema } from '@fst/server/data-access-todo';
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
  })
);

describe('ServerFeatureTodoService', () => {
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
    }).compile();

    service = module.get(ServerFeatureTodoService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
