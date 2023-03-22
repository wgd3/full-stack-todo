import { ServerFeatureUserService } from '@fst/server/feature-user';
import { IUser } from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import * as bcrypt from 'bcrypt';
import { ServerFeatureAuthService } from './server-feature-auth.service';

describe('ServerFeatureAuthService', () => {
  let service: ServerFeatureAuthService;
  let mockUser: IUser;
  let mockUserUnhashedPassword: string;

  beforeAll(async () => {
    mockUser = createMockUser();
    mockUserUnhashedPassword = mockUser.password;
    mockUser.password = await bcrypt.hash(mockUserUnhashedPassword, 10);
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: randPassword(),
        }),
      ],
      providers: [
        ServerFeatureAuthService,
        {
          provide: ServerFeatureUserService,
          useValue: {
            getOneByEmail: jest.fn(async (email, password) => {
              if (email !== mockUser.email) {
                return null;
              }
              return mockUser;
            }),
          },
        },
      ],
    }).compile();

    service = module.get(ServerFeatureAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should validate a user', async () => {
    const validUser = await service.validateUser(
      mockUser.email,
      mockUserUnhashedPassword
    );
    expect(validUser).toStrictEqual({
      id: mockUser.id,
      email: mockUser.email,
      todos: [],
    });
  });

  it('should return null for invalid user', async () => {
    const invalidUser = await service.validateUser('foo', 'bar');
    expect(invalidUser).toBe(null);
  });

  it('should generate an access token', async () => {
    const { access_token } = await service.generateAccessToken(mockUser);
    expect(access_token).toBeDefined();
    expect(typeof access_token).toBe('string');
  });
});
