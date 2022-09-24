import checkBlockExistance from "./checkBlockExistance";
import { getBlockTransactions } from "../getBlockTransactions";
import { getBlockTxStatus } from "../getBlockTxStatus";
/**
 * 
 * @param blockNumber 
 * @param verbose 
 * @returns block list of hashes and list of status
 * @dev checks to see if the block is mined yet, then returns the list of transactions hashes and transaction receipts in an array
 */
export default async function fetchBlockData(blockNumber: number, verbose: boolean = false){
    //check to see if the block is still reached in the network
    //we don't need this but it is important since it fails silently if the network is 
    //forked behind this block number
    if(verbose) console.log(`Checking Existance of the block ${blockNumber}.`);
    await checkBlockExistance(blockNumber);
    if(verbose) console.log(`Existance of block ${blockNumber} confirmed.`)
    

    if(verbose) console.log(`Fetching the transactions and receipt of the block ${blockNumber}.`);
    const txHashes = await getBlockTransactions(blockNumber);
    const txRec = await getBlockTxStatus(blockNumber, txHashes);
    if(verbose) console.log(`Transactions and receipts of block ${blockNumber} is confirmed.`)

    return [txHashes, txRec];
}