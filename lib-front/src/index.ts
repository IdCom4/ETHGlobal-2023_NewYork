import { Wisdom } from './wisdom'

async function t() {
  const b = await new Wisdom().fetchAppContributions('0x45c918ab91713dec12ab513fb73e98f600b11967')
  console.log({ b })
}

t()