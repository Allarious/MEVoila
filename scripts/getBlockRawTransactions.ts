import { getBlockTransactions } from "./getBlockTransactions";
import { getRawTransactionByHash } from "./getRawTransactionByHash";

export const getBlockRawTransactions = async (blockNumber: number) => {
    const txHashes = await getBlockTransactions(blockNumber);

    if(txHashes === undefined){
        return undefined;
    }
    if(txHashes.length === 0){
        return []
    }

    let txRaws = [];

    for(let txHash of txHashes){
        txRaws.push(await getRawTransactionByHash(txHash))
    }

    return txRaws
}
