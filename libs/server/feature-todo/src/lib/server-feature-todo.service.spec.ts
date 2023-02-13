import { Test } from '@nestjs/testing';
import { ServerFeatureTodoService } from './server-feature-todo.service';

describe('ServerFeatureTodoService', () => {
  let service: ServerFeatureTodoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureTodoService],
    }).compile();

    service = module.get(ServerFeatureTodoService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
