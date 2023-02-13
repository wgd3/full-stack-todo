import { Test } from '@nestjs/testing';
import { ServerFeatureTodoController } from './server-feature-todo.controller';
import { ServerFeatureTodoService } from './server-feature-todo.service';

describe('ServerFeatureTodoController', () => {
  let controller: ServerFeatureTodoController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureTodoService],
      controllers: [ServerFeatureTodoController],
    }).compile();

    controller = module.get(ServerFeatureTodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
