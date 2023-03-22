import { IAccessTokenPayload, IPublicUserData } from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { JwtStrategy } from './jwt-strategy.service';

describe('JwtStrategy', () => {
  let service: JwtStrategy;
  let mockUser: IPublicUserData;

  beforeAll(() => {
    process.env['JWT_SECRET'] = randPassword();
    mockUser = createMockUser();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [JwtStrategy],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an access token payload object', async () => {
    const tokenPayload: IAccessTokenPayload = {
      sub: mockUser.id,
      email: mockUser.email,
    };
    const respData = await service.validate(tokenPayload);
    expect(respData).toStrictEqual({
      userId: mockUser.id,
      email: mockUser.email,
    });
  });
});
