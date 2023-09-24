import { InjectedConnector, connect } from '@wagmi/core'

export async function connectToWallet() {
  try {
    await connect({
      connector: new InjectedConnector()
    })
  } catch (e) {
    console.error(e)
  }
}
