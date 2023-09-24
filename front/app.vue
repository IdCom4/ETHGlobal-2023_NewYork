<template>
  <section id="page-layout">
    <user-alert />
    <eth-navbar />
    <!-- <button @click="connectWallet">Connect</button>
    <button @click="sign">Sign</button>
    <button @click="signAndTransact">Transact</button> -->
    <!-- pages -->
    <NuxtPage />
  </section>
</template>

<script setup>
import { createConfig, configureChains, mainnet, writeContract, getAccount } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { signMessage } from '@wagmi/core'

import { connect, fetchEnsName } from '@wagmi/core'
import { InjectedConnector } from '@wagmi/core/connectors/injected'
import { ethers, BigNumber, Wallet } from 'ethers'
import { contractAbi } from '@/assets/ts/abi'
import { contractAddress } from './var'

const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet], [publicProvider()])

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient
})

async function connectWallet(params) {
  const { address, account } = await connect({
    connector: new InjectedConnector()
  })
}

async function sign(message) {
  const signature = await signMessage({
    message: message ? message : 'gm wagmi frens'
  })

  console.log('signature = ', signature)
  return signature
}

async function signAndTransact() {
  const message = 'Message, is cool'
  const signature = await sign(message)
  const hashedMessage = ethers.utils.hashMessage(message)

  sendDelegatedContribution('testAssetId', 'testUserInput', hashedMessage, signature)
}

async function sendDelegatedContribution(assetId, userInput, messageHash, userSignature) {
  const userAddress = getAccount().address

  const proof = {
    merkle_root: '0x1a04af3dffa970c55274470c23db1b628ac24136967b1f94366aaa57558e813c',
    nullifier_hash: '0x1ce312aa5f8e6c6f25ddef10030c07ca2860491f10e19d22aab56f12096d62c7',
    proof:
      '0x1a7b5455c8594b9b8e9621d42ada83cae1d2eef35452d443c448ad856acde81404529e93c6679ab5f944bfd7e9deb9540ad9d1a5bbfc774d5db7a255c6243a9925c712a5eb387872cf8d6f5fdcde71eeec1d77629d35c526f612ba8d2ffe9b1a0c9a011f4a063717a7849f40afe2c848a44e24028e8f0a26553cd104455fbf1a01f6e1720c642d1ac90ca2e4428fff2122fd3857faa994eeacdecbd81640708a13056791029c7745c8078e7ddf07f22fdc380bca25179239eb6a7374e4339878120fcbaecfba68a67b57d72af72a2e298881e190adac4de8ba2c365fc6e2d2b219097ec7ffa31be0b845bded8d7e0e2929f21ec8a2374badd8e7c5870798f089',
    credential_type: 'orb'
  }

  console.log('proof = ', proof)

  const unpackedProof = ethers.utils.defaultAbiCoder.decode(['uint256[8]'], proof.proof)[0].map((bigNumerObj) => bigNumerObj._hex)
  console.log('🚀 ~ file: app.vue:103 ~ sendDelegatedContribution ~ unpackedProof:', unpackedProof)

  // console.log(
  //   'payload = ',
  //   JSON.stringify([proof.merkle_root, proof.nullifier_hash, unpackedProof, assetId, userInput, userAddress, messageHash, userSignature])
  // )
  console.log('payload testHUman= ', JSON.stringify([userAddress, proof.merkle_root, proof.nullifier_hash, unpackedProof]))

  // console.log('payload= ', args)
  // console.log(contract)
  // console.log('🚀 ~ file: app.vue:110 ~ sendDelegatedContribution ~ wallet:', wallet)
  const privateKey = '45bc959c1f08afb78328c5f0fc377d68d4316a69db2560a01c19268ad3b55e93'

  const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.public.blastapi.io')

  const wallet = new Wallet(privateKey, provider)
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet)

  // const transaction = await contract.verifHuman(userAddress, proof.merkle_root, proof.nullifier_hash, unpackedProof)

  const transaction = await contract.verifyAndExecute(
    proof.merkle_root,
    proof.nullifier_hash,
    unpackedProof,
    assetId,
    userInput,
    userAddress,
    messageHash,
    userSignature,
    contractAddress
  )

  console.log('transact = ', transaction)
  await transaction.wait()

  // writeContract({
  //   address: contractAddress,
  //   abi: contractAbi,
  //   enabled: proof != null && userAddress != null,
  //   functionName: 'verifyAndExecute',
  //   args: args
  // })
}

connectWallet()
// const ensName = await fetchEnsName({ address })

//TEST
//"0x1a04af3dffa970c55274470c23db1b628ac24136967b1f94366aaa57558e813c", "0x167fb1faf19f2aa60d62b61ecc0071841bb418bdbf73cafbcb82769960e888d9", "0x00c82e0432483a92164be239607de4dfebc9b5d55d43016d8fd962806ff175ba19bf8d6779a71405a2798f46a49b198b6ca6ed59a17a029352a04cce4864099a2c315b31ccb74d463beb2f15e0d545848ec4973ce196da907edaa78c18e202352b14ec1f8fe5493b2b19404287d61758d34291965928c680862933e25bb5d05f131a1bc45e12e486a5c64890cab072b43ac1e30a967a82d469aae67709f2b10d2c626f6a55d95b9dd8882429afab6fa611027917cb60f29b010eae27d43be50625f23dcb094bf0f46c1d33448b572faf8e0f18521b66dead27cbc6c7f12e1fd81b6c5f435e76a9722666eb55b9dcf685a10182bde84740d908a719639adfd88b","le_prout","ignore","0x228A9d45a362358cCAA4c380586E62933FF4c390", "0xb6bc4fbb1c61d263dffc16a560cf65c122b5fb7df30149e72de3b1c2c2b9f1ee", "0xe6823b20154a1013534a43892bd6f2acbec03f82eb9e1258cb80fcbb5e6add6d6743db415035136b05c1be2a344eb20dbf7581dbc8b20812002ba7e55e1cd0c41c"

// import { useAccount, useConnect, useDisconnect } from 'vagmi'
// import { InjectedConnector } from 'vagmi/connectors/injected'

// const { address, isConnected } = useAccount()
// const { connect } = useConnect({
//   connector: new InjectedConnector()
// })
// const { disconnect } = useDisconnect()
</script>

<style lang="scss">
#page-layout {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;

  overflow: hidden;

  position: relative;
}
</style>
