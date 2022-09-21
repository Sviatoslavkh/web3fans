import { ethers } from "ethers";


export default function sign(message){
    var messageBytes = ethers.utils.toUtf8Bytes(message);
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x19Ethereum Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    return ethers.utils.keccak256(ethMessage);
}
