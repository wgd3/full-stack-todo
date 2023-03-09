import { Test } from '@nestjs/testing';
import { ServerFeatureHealthController } from './server-feature-health.controller';

describe('ServerFeatureHealthController', () => {
  let controller: ServerFeatureHealthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ServerFeatureHealthController],
    }).compile();

    controller = module.get(ServerFeatureHealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
