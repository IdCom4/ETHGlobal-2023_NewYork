import { execSync } from 'child_process'

export default async () => {
  execSync('yarn test:db:rm')
}
