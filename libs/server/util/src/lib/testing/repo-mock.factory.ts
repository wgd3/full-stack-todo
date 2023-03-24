import { Repository } from 'typeorm';
import { MockType } from './mock-type';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn(() => ({})),
    findOneByOrFail: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    findOneOrFail: jest.fn(() => ({})),
    delete: jest.fn(() => null),
    find: jest.fn((entities) => entities),
    remove: jest.fn((entity) => entity),
  })
);
