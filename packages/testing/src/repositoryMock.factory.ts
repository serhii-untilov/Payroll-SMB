import { Repository } from 'typeorm';
import { MockType } from './mock-type';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    create: jest.fn((entity) => entity),
    findAll: jest.fn((entities) => entities),
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn(() => ({})),
    findOneByOrFail: jest.fn((entity) => entity),
    findOneOrFail: jest.fn(() => ({})),
    update: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    delete: jest.fn(() => null),
    remove: jest.fn((entity) => entity),
}));
