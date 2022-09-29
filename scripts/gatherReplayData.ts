import hre from "hardhat";
import { replayFailedTx } from "./replayFailedTx";
import storeMapInFile from './utils/storeMapInFile';


async function gatherReplayDataLive(verbose = true){
    let currentBlock, previousBlock;
    while(true){
        currentBlock = await hre.ethers.provider.getBlockNumber();
        
        if(currentBlock === previousBlock) continue;

        // Going back to make sure the block isn't a temporary fork
        let blockNumber = Math.max(currentBlock - 50, 0);

        if(verbose) console.log(`Extracting block ${blockNumber}`);

        await replayAndStoreBlockData(blockNumber)

        previousBlock = currentBlock;
    }
}

async function gatherReplayInterval(interval: number[], fileName: string, verbose = false){
    
    let [firstBlock, lastBlock] = interval;
    let currrentBlock = await hre.ethers.provider.getBlockNumber();
    if(currrentBlock < lastBlock) throw Error("The last block of interval is not mined yet.")

    for(let blockNumber = firstBlock; blockNumber <= lastBlock; blockNumber++){
        if(verbose) console.log(`Extracting block ${blockNumber}.`);
        await replayAndStoreBlockData(blockNumber, fileName);
        if(verbose) console.log(`Finished extracting block number ${blockNumber}`);
    }
}

async function replayAndStoreBlockData(blockNumber: number, fileName = "replayData"){

    let startingTime = Date.now();
    let failedTxMap = await replayFailedTx(blockNumber, 5);
    let finishTime = Date.now();

    await storeMapInFile(failedTxMap, fileName + ".js", `"blockNumber": ${blockNumber},\n"time": ${finishTime - startingTime},`);
}

// gatherReplayInterval([14500294, 14850000], "replayData");
// gatherReplayInterval([14850001, 15200000], "replayData1");
gatherReplayInterval([15272219, 15600000], "replayData2");
// 15200078