import hre from "hardhat";
import { replayFailedTx } from "./replayFailedTx";
import storeMapInFile from './utils/storeMapInFile';

import nconf, { file } from "nconf";


export async function gatherReplayDataLive(verbose = false){
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

export async function gatherReplayInterval(fileName: string, verbose = false){

    nconf.use('file', { file: `./scripts/threads/${fileName}.json` });
    nconf.load();

    let [firstBlock, lastBlock] = getBlockNumbers();
    if(lastBlock < firstBlock) throw Error(`invalid interval start ${firstBlock}, end ${lastBlock}`);
    let currrentBlock = await hre.ethers.provider.getBlockNumber();
    if(currrentBlock < lastBlock) throw Error("The last block of interval is not mined yet.")

    for(let blockNumber = firstBlock; blockNumber <= lastBlock; blockNumber++){

        updateBlockNumber("replayData_start", blockNumber);

        if(verbose) console.log(`Extracting block ${blockNumber}.`);
        await replayAndStoreBlockData(blockNumber, fileName);
        if(verbose) console.log(`Finished extracting block number ${blockNumber}`);
    }
}

async function replayAndStoreBlockData(blockNumber: number, fileName = "replayData"){

    let startingTime = Date.now();
    let failedTxMap = await replayFailedTx(blockNumber, 4);
    let finishTime = Date.now();

    await storeMapInFile(failedTxMap, fileName + ".js", `"blockNumber": ${blockNumber},\n"time": ${finishTime - startingTime},`);
}

function updateBlockNumber(key: string, value: number, verbose = false){
    nconf.set(key, value);
    nconf.save(function (err: any) {
        if (err) {
          console.error(err.message);
          return;
        }
        if(verbose) console.log('Configuration saved successfully.');
      });
}

function getBlockNumbers(): number[]{
    return [nconf.get("replayData_start"), nconf.get("replayData_end")];
}

// gatherReplayInterval("replayData0");
// gatherReplayInterval([14850001, 15200000], "replayData1");
// gatherReplayInterval([15272219, 15600000], "replayData2");
// 15200078