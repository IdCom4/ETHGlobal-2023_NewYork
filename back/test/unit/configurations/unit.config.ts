import mainConfig from '../../../jest.config'
import { Config } from '@jest/types'

const unitConfig: Config.InitialOptions = {
  ...mainConfig,
  testRegex: '.unit-spec.ts$',
  rootDir: '../../../',
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageReporters: ['html', 'text-summary'],
  collectCoverageFrom: [...(mainConfig.collectCoverageFrom || []), '!src/repositories/**'],
}

export default unitConfig
