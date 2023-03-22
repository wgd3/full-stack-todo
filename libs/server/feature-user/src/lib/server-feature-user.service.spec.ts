import { UserEntitySchema } from '@fst/server/data-access';
import { MockType, repositoryMockFactory } from '@fst/server/util/testing';
import { IPublicUserData, IUser } from '@fst/shared/domain';
import { createMockUser } from '@fst/shared/util-testing';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ServerFeatureUserService } from './server-feature-user.service';

describe('ServerFeatureUserService', () => {
  let service: ServerFeatureUserService;
  let repoMock: MockType<Repository<IUser>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureUserService,
        {
          provide: getRepositoryToken(UserEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(ServerFeatureUserService);
    repoMock = module.get(getRepositoryToken(UserEntitySchema));
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
    expect(repoMock).toBeTruthy();
  });

  it('should be able to create a user', async () => {
    const user = createMockUser();
    const publicUser: IPublicUserData = {
      id: user.id,
      email: user.email,
      todos: [],
    };
    repoMock.save?.mockReturnValue(publicUser);
    const newUser = await service.create({
      email: user.email,
      password: user.password,
    });
    expect(newUser).toStrictEqual(publicUser);
    expect(repoMock.save).toHaveBeenCalled();
  });

  it('should throw an error if the email already exists', async () => {
    const user = createMockUser();
    repoMock.save?.mockImplementation(() => {
      const err = new QueryFailedError('unique constraint failed', [], '');
      err.message = `ERROR SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email`;
      throw err;
    });
    try {
      await service.create({ email: user.email, password: user.password });
    } catch (err) {
      expect(err).toBeInstanceOf(QueryFailedError);
    }
  });

  it('should successfully find a user', async () => {
    const user = createMockUser();
    const publicUser: IPublicUserData = {
      id: user.id,
      email: user.email,
      todos: [],
    };
    repoMock.findOneBy?.mockReturnValue(publicUser);
    expect(await service.getOne(user.id)).toStrictEqual(publicUser);
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: user.id });
  });

  it('should throw if a user could not be found', async () => {
    repoMock.findOneBy?.mockImplementation(() => null);
    try {
      await service.getOne('foo');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should find a user by email', async () => {
    const user = createMockUser();
    const publicUser: IPublicUserData = {
      id: user.id,
      email: user.email,
      todos: [],
    };
    repoMock.findOneBy?.mockReturnValue(publicUser);
    expect(await service.getOneByEmail(user.email)).toStrictEqual(publicUser);
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ email: user.email });
  });

  it('should throw if a user could not be found by email', async () => {
    repoMock.findOneBy?.mockImplementation(() => null);
    try {
      await service.getOneByEmail('foo');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
