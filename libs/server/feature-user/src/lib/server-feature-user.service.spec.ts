import { UserEntitySchema } from '@fst/server/data-access';
import { MockType, repositoryMockFactory } from '@fst/server/util';
import { IUser } from '@fst/shared/domain';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
});
