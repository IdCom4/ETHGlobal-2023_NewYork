import {ethers} from 'ethers'

console.log("bytes = ", ethers.encodeBytes32String(process.argv.slice(2)[0]))

