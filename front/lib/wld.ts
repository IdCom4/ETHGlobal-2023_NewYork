import { ethers } from 'ethers'

export const decode = <T>(type: string, encodedString: string): T => {
  return ethers.utils.defaultAbiCoder.decode([type], encodedString)[0]
}
