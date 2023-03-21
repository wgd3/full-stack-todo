import { Test } from '@nestjs/testing';
import { ServerFeatureUserService } from './server-feature-user.service';

describe('ServerFeatureUserService', () => {
  let service: ServerFeatureUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureUserService],
    }).compile();

    service = module.get(ServerFeatureUserService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
