import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default async (): Promise<JestConfigWithTsJest> => {
    return {
        verbose: true,
        moduleFileExtensions: ['js', 'json', 'ts'],
        testRegex: '.*\\.spec\\.ts$',
        transform: {
            '^.+\\.ts$': 'ts-jest',
        },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: '../coverage',
        testEnvironment: 'node',

        preset: 'ts-jest',
        moduleDirectories: ['node_modules', '<rootDir>'],
        moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    };
};
