import {ethers} from "hardhat";
import { fetchReceiptsFromBlock } from "../utils/fetchReceipts";
import { getFlashbotsBefore } from "../utils/getFlashbotsBefore";
import data from "../../replayData0";
import nconf from "nconf";

/**
 * @param numberOfBlocks Number of blocks that is used in the data imported that means the number of blocks replayed, is this really needed?
 */
async function blockCensorship(){
    nconf.use('file', { file: `./scripts/dataAnalysis/runData.json` });
    nconf.load();

    var flashbotsCounter = 0;
    var flashbotsBlocks = [];
    let start = getStartingBlock();
    for(let i = start; i < data.length; i++){
        let block = data[i];
        let obj: any = {};
        let blockNumber = block["blockNumber"];
        // console.log(blockNumber);
        let isFlashBots = false;
        let flashbotsBlock = null;
        // console.log(txs);
        //fetching flashbots if needed
        if(flashbotsCounter >= flashbotsBlocks.length){
            flashbotsCounter = 0;
            flashbotsBlocks = await getFlashbotsBefore(blockNumber + 100);
            if(flashbotsBlocks.length === 0){
                throw new Error("Flashbot server failed, reverting");
            }
            // console.log(flashbotsBlocks);
            flashbotsBlocks = flashbotsBlocks.filter((a: any) => a.block_number >= blockNumber);
        }
        //fetching blockData
        let blockData = await ethers.provider.send("eth_getBlockByNumber", ["0x" + blockNumber.toString(16), true]);

        //fetching receipts
        let blockReceipts: any[] = await fetchReceiptsFromBlock(blockNumber);

        if(flashbotsBlocks.length && flashbotsBlocks[flashbotsCounter]["block_number"] === blockNumber){
            flashbotsBlock = flashbotsBlocks[flashbotsCounter++];
            isFlashBots = true;
        }

        // console.log(blockData);
        // console.log(blockReceipts);
        // console.log(flashbotsBlocks);

        obj.hash = blockData.hash;
        obj.blockNumber = parseInt(blockData.number, 16);
        obj.isFlashBotsBlock = isFlashBots;
        obj.gasLimit = parseInt(blockData.gasLimit, 16);
        obj.gasUsed = parseInt(blockData.gasUsed, 16);
        obj.timestamp = parseInt(blockData.timestamp, 16);
        obj.numOfTxs = blockData.transactions.length;
        obj.miner = blockData.miner;

        let flashbotsTxs: any = {};
        if(isFlashBots){
            for(let [idx, tx] of flashbotsBlock.transactions.entries()){
                flashbotsTxs["" + tx.transaction_hash] = idx;
            }
        }
        obj.flashBotsTransactions = flashbotsTxs;
        obj.transactions = [];
        for(let tx of block.data){
            let txObject: any = {};
            let hash = Object.keys(tx)[0];
            let runAtBlock = Object.values(tx)[0];
            let txData = blockData.transactions.find((tx: any) => tx.hash === hash);
            // console.log(txData);
            let txReceiptData = blockReceipts.find((tx: any) => tx.transactionHash === hash);
            // console.log(txReceiptData);

            txObject.hash = hash;
            txObject.runAtBlock = runAtBlock;
            txObject.type = parseInt(txData.type, 16);
            txObject.status = parseInt(txReceiptData.status, 16);
            txObject.gasUsed = parseInt(txReceiptData.gasUsed, 16);
            txObject.gasLimit = parseInt(txData.gas, 16);
            txObject.index = parseInt(txData.transactionIndex, 16);
            txObject.gasPrice = parseInt(txData.gasPrice, 16);
            txObject.maxFeePerGas = parseInt(txData.maxFeePerGas, 16);
            txObject.maxPriorityFeePerGas = parseInt(txData.maxPriorityFeePerGas, 16);
            txObject.effectiveGasPrice = parseInt(txReceiptData.effectiveGasPrice, 16);
            txObject.cumulativeGasUsed = parseInt(txReceiptData.cumulativeGasUsed, 16);
            txObject.from = txReceiptData.from;
            txObject.to = txReceiptData.to;

            obj.transactions.push(txObject);
        }

        process.stdout.write(JSON.stringify(obj) + ',\n');

        updateStartingBlock("start", i);
    }
}
function getStartingBlock(): number{
    return nconf.get("start");
}
function updateStartingBlock(key: string, value: number, verbose = false){
    nconf.set(key, value);
    nconf.save(function (err: any) {
        if (err) {
          console.error(err.message);
          return;
        }
        if(verbose) console.log('Configuration saved successfully.');
      });
}

blockCensorship();

//
//    "blockNumber": 14499990,
//    "time": 150,
//    "data" : [
//    ],