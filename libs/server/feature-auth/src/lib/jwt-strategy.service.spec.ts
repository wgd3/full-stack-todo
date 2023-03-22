import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt-strategy.service';

describe('JwtStrategy', () => {
  let service: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
