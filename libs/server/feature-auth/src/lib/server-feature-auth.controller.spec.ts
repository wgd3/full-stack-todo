import { ServerFeatureUserService } from '@fst/server/feature-user';
import { IUser } from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
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
      controllers: [ServerFeatureAuthController],
    }).compile();

    controller = module.get(ServerFeatureAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
