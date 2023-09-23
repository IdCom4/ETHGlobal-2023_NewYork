import {Wallet, ethers, verifyMessage} from 'ethers'

const wallet = new Wallet('45bc959c1f08afb78328c5f0fc377d68d4316a69db2560a01c19268ad3b55e93')

const message = 'testMessage'


async function run()
{

    console.log("walled addres = ", wallet.address)
    console.log("signedMessage = ", await wallet.signMessage(message))
    console.log("hashedMessage = ", ethers.hashMessage(message))
    console.log("verifiedMessage", verifyMessage(message, await wallet.signMessage(message)))  
    wallet.signMessage

}

run()

