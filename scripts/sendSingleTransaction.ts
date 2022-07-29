
import { network, ethers } from 'hardhat';
import { getRawTransactionByHash } from './getRawTransactionByHash';

export const sendSingleTransaction = async (txObject: any) => {

    //To include all sent transaction in a single block
    //TODO check and see if this mines all already pending transactions?
    //TODO get the setAutomine before and set it afterwards
    await network.provider.send("evm_setAutomine", [true]);

    let txRaw;

    if(typeof(txObject) === "string"){
        txRaw = txObject;
    } else {
        txRaw = await getRawTransactionByHash(txObject);
    }

    const output = await ethers.provider.send(
            "eth_sendRawTransaction",
            [txRaw]
        );

    return output
}