import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ServerFeatureAuthGoogleController } from './server-feature-auth-google.controller';
import { ServerFeatureAuthGoogleService } from './server-feature-auth-google.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerFeatureAuthService } from '@fst/server/feature-auth';

describe('ServerFeatureAuthGoogleController', () => {
  let controller: ServerFeatureAuthGoogleController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        ServerFeatureAuthGoogleService,
        {
          provide: ServerFeatureAuthService,
          useValue: {},
        },
      ],
      controllers: [ServerFeatureAuthGoogleController],
    }).compile();

    controller = module.get(ServerFeatureAuthGoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
