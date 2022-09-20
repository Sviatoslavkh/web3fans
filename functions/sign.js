import { ethers } from "ethers";


export default function sign(message){
    var messageBytes = ethers.utils.toUtf8Bytes("balance\n\nId: 8rtPEYWiZ3NkIKHF7itUmrfUKSUoGcFgnHvTFCDp:1663496773937");
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x19Ethereum Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    return ethers.utils.keccak256(ethMessage);
}
