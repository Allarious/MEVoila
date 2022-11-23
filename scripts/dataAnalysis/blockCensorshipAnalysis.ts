// import data from "../../replayData0";
var data: any[] = [14499990];
import {ethers} from "hardhat";

/**
 * @param numberOfBlocks Number of blocks that is used in the data imported that means the number of blocks replayed, is this really needed?
 */
async function blockCensorship(numberOfBlocks: number){

    var blockToMaxGas = {};
    for(let entry of data){
        let blockNumber = entry.blockNumber;
        let blockData = await ethers.provider.send("eth_getBlockByNumber", [blockNumber]);
        console.log(blockData);
    }
}

blockCensorship(4);

//
//    "blockNumber": 14499990,
//    "time": 150,
//    "data" : [
//    ],