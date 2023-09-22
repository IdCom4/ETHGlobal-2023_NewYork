import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/js-with-ts',
  rootDir: './',
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true,
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!puppeteer-core/.*)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@Api/(.*)$': '<rootDir>/src/API/$1',
    '^@Schemas/(.*)$': '<rootDir>/src/schemas/$1',
    '^@Common/(.*)$': '<rootDir>/src/common/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/index.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.module.ts',
    '!src/schemas/**/*blueprint.ts',
    '!src/common/external-service-providers-api/**',
    '!src/common/enums/**',
    '!src/common/request-io/**',
  ],
  testRegex: '.*-spec\\.ts$',
  setupFilesAfterEnv: ['reflect-metadata'],
}

export default config
