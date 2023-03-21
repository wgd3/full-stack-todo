import { Test } from '@nestjs/testing';
import { ServerFeatureUserController } from './server-feature-user.controller';
import { ServerFeatureUserService } from './server-feature-user.service';

describe('ServerFeatureUserController', () => {
  let controller: ServerFeatureUserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureUserService],
      controllers: [ServerFeatureUserController],
    }).compile();

    controller = module.get(ServerFeatureUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
