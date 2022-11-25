
import {ethers} from "hardhat";
import storeObjectInFile from "../utils/storeObjectInFile";

/**
 * @param numberOfBlocks Number of blocks that is used in the data imported that means the number of blocks replayed, is this really needed?
 */
async function blockCensorship(numberOfBlocks: number){
    for(let blockNumber = 14531522; blockNumber < 15500000; blockNumber++){
        // console.log(blockNumber);
        let blockData = await ethers.provider.send("eth_getBlockByNumber", ["0x" + blockNumber.toString(16), false]);
        let {
            gasLimit,
            gasUsed
        } = blockData;

        let storeObj = {
            blockNumber,
            gasLimit: parseInt(gasLimit, 16),
            gasUsed: parseInt(gasUsed, 16)
        }
        await storeObjectInFile(storeObj, "blockData.js");
    }
}

blockCensorship(4);

//
//    "blockNumber": 14499990,
//    "time": 150,
//    "data" : [
//    ],