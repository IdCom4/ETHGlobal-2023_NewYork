import { execSync } from 'child_process'

const globalBeforeEach = () => {
  execSync('yarn test:db:prepopulate')
}

const globalAfterEach = () => {
  execSync('yarn test:db:clean')
}

global.beforeEach(() => globalBeforeEach())
global.afterEach(() => globalAfterEach())
