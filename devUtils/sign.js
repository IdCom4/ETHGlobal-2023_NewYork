import {Wallet, ethers, verifyMessage} from 'ethers'

const wallet = new Wallet('c4d9f01b3e9f7cfa8dfc5919a07e540227c6ba1668fb3c997d4623019aa0d4f9')

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

