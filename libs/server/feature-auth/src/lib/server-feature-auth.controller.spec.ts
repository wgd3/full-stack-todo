import { ServerFeatureUserService } from '@fst/server/feature-user';
import { IUser } from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import * as bcrypt from 'bcrypt';
import { ServerFeatureAuthController } from './server-feature-auth.controller';
import { ServerFeatureAuthService } from './server-feature-auth.service';

describe('ServerFeatureAuthController', () => {
  let controller: ServerFeatureAuthController;
  let mockUser: IUser;
  let mockUserUnhashedPassword: string;

  beforeAll(async () => {
    const originalPassword = 'foobar';
    mockUser = createMockUser();
    mockUserUnhashedPassword = originalPassword;
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
            getOneByEmailOrFail: jest.fn(async (email, password) => {
              if (email !== mockUser.email) {
                throw new NotFoundException();
              }
              return mockUser;
            }),
          },
        },
      ],
      controllers: [ServerFeatureAuthController],
    }).compile();

    controller = module.get(ServerFeatureAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should login a user', async () => {
    const res = await controller.login({
      email: mockUser.email ?? '',
      password: mockUserUnhashedPassword,
    });
    expect(res.access_token).toBeDefined();
    expect(typeof res.access_token).toBe('string');
  });

  it('should throw with a bad email', async () => {
    try {
      await controller.login({
        email: 'foo@bar.com',
        password: '',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
