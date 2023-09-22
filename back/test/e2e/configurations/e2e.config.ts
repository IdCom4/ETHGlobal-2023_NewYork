import mainConfig from '../../../jest.config'
import { Config } from '@jest/types'

const e2eConfig: Config.InitialOptions = {
  ...mainConfig,
  setupFilesAfterEnv: ['./test/e2e/configurations/e2e.setup-each.ts'],
  testRegex: '.e2e-spec.ts$',
  rootDir: '../../../',
  globalSetup: '<rootDir>/test/e2e/configurations/e2e.setup.ts',
  globalTeardown: '<rootDir>/test/e2e/configurations/e2e.teardown.ts',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.module.ts'],
  coverageDirectory: '<rootDir>/test/e2e/coverage',
  coverageReporters: ['html', 'text-summary'],
}

export default e2eConfig
