import { getBlockTransactions } from './getBlockTransactions';
import { getBlockTxStatus } from './getBlockTxStatus';
import { getTransactionByHash } from './getTransactionByHash';
import hre from 'hardhat';

// DUPLICATE FILE GO TO replayFailedTx.ts //


/**
 * 
 * @param blockNumber
 * @param previousBlocks the number of blocks that the failed transactions go back until it can run
 * @param verbose
 * @return {number} 
 * 
 * @dev This function gets extracts all the failed transactions inside a `blockNumber` from Ethereum and 
 * re-runs the transactions at the start of each block for the last `previousBlock`s and returns the first
 * block that the transaction runs if the transaction is failed for all of the `previousBlocks` blocks 
 * then it returns 0;
 * This function does not need to worry about the current state having access to the blocknumber, this might
 * not be the best design decision!
 */
async function checkFailedTransactionsOnPreviousBlocks(blockNumber: number, previousBlocks: number, verbose = true){

    if(verbose) console.log(`Getting block ${blockNumber} transactions...`);
    let blockTxHashes = await getBlockTransactions(blockNumber);
    if(verbose) console.log(`Transactions from block ${blockNumber} received`);

    if(verbose) console.log(`Getting block ${blockNumber} transaction statuses...`);
    let blockSts = await getBlockTxStatus(blockNumber);
    if(verbose) console.log(`Statuses from block ${blockNumber} received`);

    if(blockSts === undefined){
        throw Error('Block status array is undefined');
    }

    if(blockTxHashes === undefined){
        throw Error('Block transactions array is undefined');
    }

    if(blockTxHashes.length != blockSts.length){
        throw Error(`The length of transactions array and status array is not equal.`)
    }

    let failedTxHashes = [];
    for(let [idx, sts] of blockSts?.entries()){
        if(sts === "0x0") failedTxHashes.push(blockTxHashes[idx]);
    }

    let failedTxObjects = [];
    for(let txHash of failedTxHashes){
        let txObj = await getTransactionByHash(txHash);
        failedTxObjects.push(txObj);
    }

    console.log(failedTxHashes);
    
    //TODO: define an array to hold the first success of these transactions, if it did not succeed in any of the blocks, then just put in 0
    for(let failedTx of failedTxObjects){
        for(
            let contextBlockNumber = blockNumber - 1;
            contextBlockNumber > blockNumber - 1 - previousBlocks;
            contextBlockNumber--
            ){
                try{
                    await hre.network.provider.send("eth_call", [
                        failedTx,
                        blockNumber - 1
                    ]);
                }catch(err){
                    console.log(`Transaction replay at block depth ${blockNumber - contextBlockNumber} of its original position failed with hash ${failedTx.hash}.`);
                    console.log(err);
                }
            }
    }
}

checkFailedTransactionsOnPreviousBlocks(15341701, 5)