import {Wallet, ethers, verifyMessage} from 'ethers'

const wallet = new Wallet()

const message = 'testMessage'


async function run()
{

    console.log("walled addres = ", wallet.address)
    console.log("message = ", message)
    console.log("hashedMessage = ", ethers.hashMessage(message))
    console.log("signedMessage = ", await wallet.signMessage(message))
    console.log("verifiedMessage", verifyMessage(message, await wallet.signMessage(message)))  
    wallet.signMessage

}

run()

