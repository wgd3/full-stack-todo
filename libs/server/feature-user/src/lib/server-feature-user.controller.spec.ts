import { UserEntitySchema } from '@fst/server/data-access';
import { repositoryMockFactory } from '@fst/server/util/testing';
import { IPublicUserData } from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randEmail } from '@ngneat/falso';
import { ServerFeatureUserController } from './server-feature-user.controller';
import { ServerFeatureUserService } from './server-feature-user.service';

describe('ServerFeatureUserController', () => {
  let controller: ServerFeatureUserController;
  let service: ServerFeatureUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureUserService,
        {
          provide: getRepositoryToken(UserEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [ServerFeatureUserController],
    }).compile();

    controller = module.get(ServerFeatureUserController);
    service = module.get(ServerFeatureUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it('should create a user', async () => {
    const user = createMockUser();
    const { password, ...publicUser } = user;
    jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));
    const res = await controller.createUser({
      email: user.email ?? '',
      password: user.password ?? '',
      familyName: null,
      givenName: null,
      profilePicture: null,
      socialId: null,
      socialProvider: null,
    });
    expect(res).toStrictEqual(publicUser);
  });

  it('should get user details if authenticated', async () => {
    const user = createMockUser();
    const publicUser: IPublicUserData = {
      id: user.id,
      email: user.email,
      todos: [],
      profilePicture: user.profilePicture,
      familyName: user.familyName,
      givenName: user.givenName,
      socialId: user.socialId,
      socialProvider: user.socialProvider,
    };
    jest.spyOn(service, 'getOneOrFail').mockReturnValue(Promise.resolve(user));
    const res = await controller.getUser(user.id, user.id);
    expect(res).toStrictEqual(publicUser);
  });

  it('should not get user details if not authenticated', async () => {
    const user = createMockUser();
    const user2 = createMockUser();
    try {
      await controller.getUser(user.id, user2.id);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should update an authenticated user', async () => {
    const user = createMockUser();
    const publicUser: IPublicUserData = {
      id: user.id,
      email: user.email,
      todos: [],
      profilePicture: user.profilePicture,
      familyName: user.familyName,
      givenName: user.givenName,
      socialId: user.socialId,
      socialProvider: user.socialProvider,
    };
    jest.spyOn(service, 'updateUser').mockReturnValue(Promise.resolve(user));
    const res = await controller.updateUser(user.id, user.id, {
      email: randEmail(),
    });
    expect(res).toStrictEqual(publicUser);
  });

  it('should not update an unauthenticated user', async () => {
    const user = createMockUser();
    const user2 = createMockUser();
    try {
      await controller.updateUser(user.id, user2.id, {});
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should delete a user if authenticated', async () => {
    const user = createMockUser();

    jest.spyOn(service, 'deleteUser').mockReturnValue(Promise.resolve(null));
    const res = await controller.deleteUser(user.id, user.id);
    expect(res).toStrictEqual(null);
  });

  it('should not update an unauthenticated user', async () => {
    const user = createMockUser();
    const user2 = createMockUser();
    try {
      await controller.deleteUser(user.id, user2.id);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
