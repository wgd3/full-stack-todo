import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ServerFeatureAuthGoogleService } from './server-feature-auth-google.service';

describe('ServerFeatureAuthGoogleService', () => {
  let service: ServerFeatureAuthGoogleService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [ServerFeatureAuthGoogleService],
    }).compile();

    service = module.get(ServerFeatureAuthGoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
