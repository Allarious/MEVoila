import { getBlockTransactions } from "./getBlockTransactions";
import { getRawTransactionByHash } from "./getRawTransactionByHash";

export const getBlockRawTransactions = async (blockNumber: number) => {
    const txHashes = await getBlockTransactions(blockNumber);

    if(txHashes === undefined){
        return undefined;
    }

    let txRaws = [];

    for(let txHash of txHashes){
        txRaws.push(await getRawTransactionByHash(txHash))
    }

    return txRaws
}
