
import {Wallet, ethers, verifyMessage} from 'ethers'
import { contractAbi } from './abi'

const wallet = new Wallet('45bc959c1f08afb78328c5f0fc377d68d4316a69db2560a01c19268ad3b55e93')

const message = 'testMessage'


const proof = {
    "merkle_root": "0x1a04af3dffa970c55274470c23db1b628ac24136967b1f94366aaa57558e813c",
    "nullifier_hash": "0x06109faa615aa038d2edcd75c890791051bbc06f3beff3663e685e71be11862f",
    "proof": "0x0834441a44f0498002c3c7e1b29b5bfdc668a6c545c83c2e9eee5f099716c9402fecc837fb8a0c2b37fe20a947369197a732700197583b37f43540899d65d09415a6243e7477a7062ea899fd2a6de4494efff6dbd2181b44603ec117477374fb101e38328e23ba6e25c46c0cefbf1d80b9bdebf10f9c05c389af08267a10579826f60f4b45699a497ffdd5ad9deb43e262a9f3d5d3b11d86ef5bde6924a1a2e02b0c49dd3a4b9f0d8d4012d761b025a1b4195ee182787a795ec9becd2fbaba68026ecb36af667dc65d787ebda12012b86ed1e0f9b38a78ffe6315b02e18dcab223a3b9d4b95e655eb0b7bc94084882fbae6f70875ef2dd358a49666b903299cd",
    "credential_type": "orb"
  }

const abi = contractAbi

async function run()
{


    

    const contractAddress = '0xf8B395eDb2BB8B9dd3626FF825D1b1E7d8fF4DeC'

    wallet.sendTransaction({})
    console.log("walled addres = ", wallet.address)
    console.log("signedMessage = ", await wallet.signMessage(message))
    console.log("hashedMessage = ", ethers.hashMessage(message))
    console.log("verifiedMessage", verifyMessage(message, await wallet.signMessage(message)))  
    wallet.signMessage

}

run()


