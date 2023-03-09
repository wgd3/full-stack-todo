import { ToDoEntitySchema } from '@fst/server/data-access-todo';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerFeatureTodoController } from './server-feature-todo.controller';
import { ServerFeatureTodoService } from './server-feature-todo.service';
import { repositoryMockFactory } from './server-feature-todo.service.spec';

describe('ServerFeatureTodoController', () => {
  let controller: ServerFeatureTodoController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
