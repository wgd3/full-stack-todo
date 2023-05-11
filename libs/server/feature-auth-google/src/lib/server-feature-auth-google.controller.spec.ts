import { Test } from '@nestjs/testing';
import { ServerFeatureAuthGoogleController } from './server-feature-auth-google.controller';
import { ServerFeatureAuthGoogleService } from './server-feature-auth-google.service';

describe('ServerFeatureAuthGoogleController', () => {
  let controller: ServerFeatureAuthGoogleController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureAuthGoogleService],
      controllers: [ServerFeatureAuthGoogleController],
    }).compile();

    controller = module.get(ServerFeatureAuthGoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
