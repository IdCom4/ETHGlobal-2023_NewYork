import mainConfig from '../../../jest.config'
import { Config } from '@jest/types'

const e2eConfig: Config.InitialOptions = {
  ...mainConfig,
  testRegex: '.int-spec.ts$',
  rootDir: '../../../',
  globalTeardown: '<rootDir>/test/e2e/configurations/e2e.teardown.ts',
  coverageDirectory: '<rootDir>/test/integration/coverage',
  coverageReporters: ['html', 'text-summary'],
}

export default e2eConfig
