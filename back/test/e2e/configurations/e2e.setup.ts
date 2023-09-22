import { execSync } from 'child_process'

export default async () => {
  execSync('yarn test:db:up')
  execSync('yarn test:db:data')
}
