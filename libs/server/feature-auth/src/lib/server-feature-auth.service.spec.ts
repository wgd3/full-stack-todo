import { ServerFeatureUserService } from '@fst/server/feature-user';
import { IUser } from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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
    mockUserUnhashedPassword = mockUser.password as string;
    mockUser.password = await bcrypt.hash(mockUserUnhashedPassword, 10);
    console.log(`Using email ${mockUser.email}`);
    console.log(
      `Hashed password '${mockUserUnhashedPassword}': ${mockUser.password}`
    );
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
            getOneByEmailOrFail: jest.fn(async (email) => {
              console.log(`looking up email ${email}`);
              if (email !== mockUser.email) {
                console.log(`Throwing not found for email ${email}`);
                throw new NotFoundException(`User could not be found`);
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
    console.log(
      `Testing user ${mockUser.email} / password ${mockUserUnhashedPassword}`
    );
    const tokenResp = await service.validateUser({
      email: mockUser.email as string,
      password: mockUserUnhashedPassword,
    });
    expect(tokenResp.access_token).toBeDefined();
  });

  it('should return null for invalid user', async () => {
    try {
      await service.validateUser({
        email: 'foo',
        password: 'bar',
      });
    } catch (err) {
      expect(err instanceof BadRequestException).toBe(true);
    }
    // const invalidUser = await service.validateUser({
    //   email: 'foo',
    //   password: 'bar',
    // });
    // expect(invalidUser).toBe(null);
  });

  it('should generate an access token', async () => {
    const { access_token } = await service.generateAccessToken({
      ...mockUser,
      sub: mockUser.id,
    });
    expect(access_token).toBeDefined();
    expect(typeof access_token).toBe('string');
  });
});
