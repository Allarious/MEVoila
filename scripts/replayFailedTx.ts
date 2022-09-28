import fetchBlockData from './utils/fetchBlockData';
import { getTransactionByHash } from './getTransactionByHash';
import hre from 'hardhat';


/**
 * 
 * @param blockNumber number of block to be replayed
 * @param replayBlocks amount of previous blocks to replay the blocks on
 * @dev This function take a blockNumber as an input, extracts the relevant block from Ethereum mainnet and replays
 * the failed transactions on the previous blocks.
 */
export const replayFailedTx = async function(blockNumber: number, replayBlocks: number, verbose: boolean = false){

    const [txHashes, txRec] = await fetchBlockData(blockNumber);

    if(!txHashes && !txRec) console.log(`Block ${blockNumber} is empty.`);

    if(!txHashes || !txRec || txHashes.length != txRec.length){
        throw Error(`Transactions length does not match up with receipt length in block ${blockNumber}`);
    }

    if(verbose) console.log(`Extracting failed transactions of the block ${blockNumber}`);

    let failedTxObjects = [];
    for(let [idx, txHash] of txHashes.entries()){
        if(txRec[idx] === "0x0"){
            let txObj = await getTransactionByHash(txHash);
            normalizeTransactions(txObj);
            failedTxObjects.push(txObj);
        }
    }

    if(verbose) console.log(`Failed transactions are extracted and are ${failedTxObjects}`);

    let newFailedObj: any[] = [];
    let failedTxMap = new Map();
    for(
        let block = blockNumber;
        block > blockNumber - replayBlocks;
        block--
        ){
            for(let failedObj of failedTxObjects)
            {
                try{
                    let blockValue = hre.ethers.utils.hexValue(hre.ethers.BigNumber.from((block - 1)));
                    const replaySts = await hre.ethers.provider.send("eth_call", [failedObj, blockValue]);
                    if(verbose) console.log(replaySts);
                    failedTxMap.set(failedObj.hash, block);
                    if(verbose) console.log(`Success at the start of the block ${block}, transaction hash ${failedObj.hash}`);
                }catch(e){
                    newFailedObj.push(failedObj);
                    if(verbose) console.log(`Fail at the start of the block ${block}, transaction hash ${failedObj.hash}`);
                }
            }
            failedTxObjects = newFailedObj;
            newFailedObj = [];
            if(!failedTxObjects.length) break;
    }

    for(let remainedFailedTx of failedTxObjects){
        failedTxMap.set(remainedFailedTx.hash, 0);
    }

    return failedTxMap;


    // Util functions //

    /**
     * 
     * @param txObj 
     * @returns changes transaction object in-place to have the correct fields
     */
    function normalizeTransactions(txObj: any){
        if(!txObj) throw Error('Transaction object should not be undefined.');
        txObj.gasPrice = undefined;
        txObj.data = txObj.input;
    }

}