import { Test } from '@nestjs/testing';
import { ServerFeatureAuthService } from './server-feature-auth.service';

describe('ServerFeatureAuthService', () => {
  let service: ServerFeatureAuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureAuthService],
    }).compile();

    service = module.get(ServerFeatureAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
