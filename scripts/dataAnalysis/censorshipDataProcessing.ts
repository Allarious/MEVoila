// import data from "../../censorshipData/censorshipData1";
import data from "../../censorshipData/censorshipData02";

/**
 * @dev Processes censorship data for the final data outputs
 */
function censorshipDataProcessing(){

    var blockGas: any = {};
    var blockGasFb: any = {};

    var rationalityPreviousBlocks = Array.from({length: 4}, () => 0);
    var rationalityPreviousFbBlocks = Array.from({length: 4}, () => 0);

    var censorshipByDistanceFb: any = Array.from({length: 4}, () => 0);
    var censorshipByDistance: any = Array.from({length: 4}, () => 0);

    var maxCensorshipMap: any = {};
    var isFlashbots: any = {};

    var censorerMaxValFb: any = Array.from({length: 4}, () => 0);
    var censorerMaxVal: any = Array.from({length: 4}, () => 0);

    var goodBlocksFb: any = 0;
    var goodBlocks: any = 0;

    var irrationalTransactions: number = 0;
    var irrationalTransactionsFb: number = 0;

    var rationalTxGas: any = {};
    var irrationalTxGas: any = {};
    var rationalTxGasFb: any = {};
    var irrationalTxGasFb: any = {};

    var rationalTxIndex: any = {};
    var irrationalTxIndex: any = {};
    var rationalTxIndexFb: any = {};
    var irrationalTxIndexFb: any = {};

    var censorship: any = Array.from({length: 3}, () => 0);
    var censorshipFb: any = Array.from({length: 3}, () => 0);

    var censorshipAmount: any = 0;
    var censorshipAmountFb: any = 0;

    var numberOfTransactions: any = 0;
    var numberOfTransactionsFb: any = 0;

    var numberOfFailedTransactions: any = 0;
    var numberOfFailedTransactionsFb: any = 0;

    var numberOfRationalTransactions: any = 0;
    var numberOfRationalTransactionsFb: any = 0;

    var overAllGasUsed: any = 0;
    var overAllGasUsedFb: any = 0;

    var gasPriceRational: any = 0
    var gasPriceRationalFb: any = 0
    
    var gasPriceIrrational: any = 0
    var gasPriceIrrationalFb: any = 0;

    var landedInFb: any = 0;
    var landedInNormal: any = 0;

    var minersFb: any = {};
    var miners: any = {};

    var minersPointsFb: any = {};
    var minersPoints: any = {};

    var minersBlocksFb: any = {};
    var minersBlocks: any = {};

    var minersFilter: any = {};

    var suspBlocks = 0;
    var suspBlocksFb = 0;
    var suspBlocksMap: any = {};

    var flashbotsBundleTxNum = 0;

    for(let index = 0;
        index < data.length;
        index++){
            let block = data[index];
            let blockNumber = block["blockNumber"];
            let isFb = block["isFlashBotsBlock"];
            let numOfTxs = block["numOfTxs"];
            let miner = block["miner"];

            isFlashbots[blockNumber] = isFb;
            // if(isFb){
            //     /**
            //     * Block gas check for fb/normal
            //     */
            //     addToDict(blockGasFb, block.gasUsed, 100000);
            //     numberOfTransactionsFb += numOfTxs;
            //     numberOfFailedTransactionsFb += block.transactions.length;
            //     overAllGasUsedFb += block.gasUsed;
            // }else{
            //     addToDict(blockGas, block.gasUsed, 100000);
            //     numberOfTransactions += numOfTxs;
            //     numberOfFailedTransactions += block.transactions.length;
            //     overAllGasUsed += block.gasUsed;
            // }

            if(numOfTxs === 0){
                continue;
            }

            if(isFb){
                flashbotsBundleTxNum += Object.keys(block["flashBotsTransactions"]).length;
            }

           for(let tx of block.transactions){
                /**
                * Counting the rational transactions based on how many blocks back they run
                * Counting the histogram of gas used in each transactions and gathering them inside objects
                * Counting the transactions based on their index
                */
               if(tx.runAtBlock === "0"){
                    // if(isFb){
                    //     //irrational Fb
                    //     irrationalTransactionsFb += 1
                    //     gasPriceIrrationalFb += tx.gasUsed;
                    //     addToDict(irrationalTxGasFb, tx.gasUsed, 1000);
                    //     addToDict(irrationalTxIndexFb, tx.index * 300 / numOfTxs);
                    // }else{
                    //     //irrational
                    //     irrationalTransactions += 1;
                    //     gasPriceIrrational += tx.gasUsed;
                    //     addToDict(irrationalTxGas, tx.gasUsed, 1000);
                    //     addToDict(irrationalTxIndex, tx.index * 300 / numOfTxs);
                    // }
               }else{
                    let previousBlocks = blockNumber - parseInt(tx.runAtBlock);
                    let isCensored = false;
                    for(let p = 1; p <= previousBlocks; p++){
                        // blocknumber = blockNumber - p
                        // p index previousblocks - p
                        let runAtBlockData = data[index - p];
                        if(!runAtBlockData) continue;

                        // console.log("index ", blockNumber - p);
                        // console.log("max ", previousBlocks - p);
                        maxCensorshipMap[blockNumber - p] =  maxCensorshipMap[blockNumber - p] ? Math.max(maxCensorshipMap[blockNumber - p] , previousBlocks - p) : previousBlocks - p;

                        if(suspBlocksMap[blockNumber - p] === undefined){
                            suspBlocksMap[blockNumber - p] = true;
                            if(runAtBlockData["isFlashBotsBlock"]){
                                suspBlocksFb++;
                            }else{
                                suspBlocks++;
                            }
                        }

                        if(runAtBlockData){
                            if(runAtBlockData["blockNumber"] !== blockNumber - p){
                                throw new Error(`blocks are not in order block ${runAtBlockData["blockNumber"]} is found instead of ${blockNumber - p}`);
                            }
                            let gasLeft = runAtBlockData.gasLimit - runAtBlockData.gasUsed;
                            if(gasLeft >= tx.gasLimit){

                                isCensored = true;

                                if(runAtBlockData["isFlashBotsBlock"] === true){
                                    censorshipAmountFb += 1;
                                    censorshipByDistanceFb[previousBlocks - p] += 1;
                                }else{
                                    censorshipAmount += 1;
                                    censorshipByDistance[previousBlocks - p] += 1;
                                }
                                if(isFb){
                                    censorshipFb[p - 1] += 1;
                                }else{
                                    censorship[p - 1] += 1;
                                }
                            }
                        }
                    }

                    if(isCensored){
                        if(isFb){
                            landedInFb++;
                        }else{
                            landedInNormal++;
                        }
                    }

                    // if(isFb){
                    //     //rational Fb
                    //     rationalityPreviousFbBlocks[previousBlocks] += 1;
                    //     numberOfRationalTransactionsFb += 1;
                    //     gasPriceRationalFb += tx.gasUsed;
                    //     addToDict(rationalTxGasFb, tx.gasUsed, 1000);
                    //     addToDict(rationalTxIndexFb, tx.index * 300 / numOfTxs);
                    // }else{
                    //     //rational
                    //     rationalityPreviousBlocks[previousBlocks] += 1;
                    //     numberOfRationalTransactions += 1;
                    //     gasPriceRational += tx.gasUsed;
                    //     addToDict(rationalTxGas, tx.gasUsed, 1000);
                    //     addToDict(rationalTxIndex, tx.index * 300 / numOfTxs);
                    // }
               }
           }
    }

    for(let index = 0;
        index < data.length;
        index++){

            let block = data[index];
            let blockNumber = block["blockNumber"];
            let isFb = block["isFlashBotsBlock"];
            let miner = block["miner"];

            if(isFb){
                minersBlocksFb[miner] = minersBlocksFb[miner] ? minersBlocksFb[miner] + 1 : 1;
            }else{
                minersBlocks[miner] = minersBlocks[miner] ? minersBlocks[miner] + 1 : 1;
            }

            if(maxCensorshipMap[blockNumber] === undefined){
                if(isFb){
                    goodBlocksFb++;
                }else{
                    goodBlocks++;
                }
            }else{
                let blockCensorshipPoint = maxCensorshipMap[blockNumber] ? maxCensorshipMap[blockNumber] : 0;
                if(isFb){
                    censorerMaxValFb[maxCensorshipMap[blockNumber]] += 1;
                    minersFb[miner] = minersFb[miner] ? minersFb[miner] + 1 : 1;
                    minersPointsFb[miner] = minersPointsFb[miner] ? minersPointsFb[miner] +  blockCensorshipPoint : blockCensorshipPoint;
                }else{
                    censorerMaxVal[maxCensorshipMap[blockNumber]] += 1;
                    miners[miner] = miners[miner] ? miners[miner] + 1 : 1;
                    minersPoints[miner] = minersPoints[miner] ? minersPoints[miner] + blockCensorshipPoint : blockCensorshipPoint;
                }
            }
    }

    // console.log("blockGas: ", blockGas, ",");
    // console.log("blockGasFb: ", blockGasFb, ",");

    // console.log("rationalityPreviousBlocks: ", rationalityPreviousBlocks, ",")
    // console.log("rationalityPreviousFbBlocks: ", rationalityPreviousFbBlocks, ",");

    // console.log("irrationalTransactions: ", irrationalTransactions, ",");
    // console.log("irrationalTransactionsFb: ", irrationalTransactionsFb, ",");

    // console.log("rationalTxGas: ", rationalTxGas, ",");
    // console.log("irrationalTxGas: ", irrationalTxGas, ",");
    // console.log("rationalTxGasFb: ", rationalTxGasFb, ",")
    // console.log("irrationalTxGasFb: ", irrationalTxGasFb, ",")

    // console.log("rationalTxIndex: ", rationalTxIndex, ",");
    // console.log("irrationalTxIndex: ", irrationalTxIndex, ",");
    // console.log("rationalTxIndexFb: ", rationalTxIndexFb, ",");
    // console.log("irrationalTxIndexFb: ", irrationalTxIndexFb, ",");

    // console.log("censorship: ", censorship, ",");
    // console.log("censorshipFb: ", censorshipFb, ",");

    // console.log("censorshipAmount: ", censorshipAmount, ",");
    // console.log("censorshipAmountFb: ", censorshipAmountFb, ",");

    // console.log("numberOfTransactions: ", numberOfTransactions, ",")
    // console.log("numberOfTransactionsFb: ", numberOfTransactionsFb, ",");

    // console.log("numberOfFailedTransactions: ", numberOfFailedTransactions, ",");
    // console.log("numberOfFailedTransactionsFb: ", numberOfFailedTransactionsFb, ",");

    // console.log("numberOfRationalTransactions: ", numberOfRationalTransactions, ",");
    // console.log("numberOfRationalTransactionsFb: ", numberOfRationalTransactionsFb, ",");

    // console.log("overAllGasUsed: ", overAllGasUsed, ",");
    // console.log("overAllGasUsedFb: ", overAllGasUsedFb, ",");

    // console.log("gasPriceRational: ", gasPriceRational, ",");
    // console.log("gasPriceRationalFb: ", gasPriceRationalFb, ",");
    
    // console.log("gasPriceIrrational: ", gasPriceIrrational, ",");
    // console.log("gasPriceIrrationalFb: ", gasPriceIrrationalFb, ",");

    // console.log("censorshipByDistanceFb:", censorshipByDistanceFb, ",");
    // console.log("censorshipByDistance", censorshipByDistance, ",");

    // console.log("landedInFb", landedInFb, ",");
    // console.log("landedInNormal", landedInNormal, ",");

    // console.log("censorerMaxFb:", censorerMaxValFb, ",");
    // console.log("censorerMax:", censorerMaxVal, ",");

    // console.log("goodBlocksFb:", goodBlocksFb, ",");
    // console.log("goodBlocks:", goodBlocks, ",");

    // console.log("minersFb:", sortMapBasedOnKey(minersFb), ",");
    // console.log("miners:", sortMapBasedOnKey(miners), ",");

    // console.log("minersPointsFb:", sortMapBasedOnKey(minersPointsFb), ",");
    // console.log("minersPoints:", sortMapBasedOnKey(minersPointsFb), ",");

    // console.log("minersBlocksFb:", sortMapBasedOnKey(minersBlocksFb), ",");
    // console.log("minersBlocks:", sortMapBasedOnKey(minersBlocks), ",");

    console.log("suspBlocks:", suspBlocks, ",");
    console.log("suspBlocksFb:", suspBlocksFb, ",");
    console.log("flashbotsBundleTxNum:", flashbotsBundleTxNum, ",");

    function addToDict(dict: any,  val: number, factor: number = 1){
        let index = Math.floor(val / factor);
        dict[index] = dict[index] ? dict[index] + 1 : 1;
    }

    function sortMapBasedOnKey(obj: any) : any{
        let arr = [];
        let sortedKeyArr = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
        for(let key of sortedKeyArr){
            arr.push([key, obj[key]]);
        }
        return arr;
    }
}

censorshipDataProcessing();