import { add } from "nconf";
import data from "../../censorshipData/censorshipData1";

// for(let i = 0; i < data.length; i++){
//     if(data[i]["blockNumber"] != data[i + 1]["blockNumber"] - 1){
//         console.log(data[i]["blockNumber"]);
//     }
// }

/**
 * @dev Processes censorship data for the final data outputs
 */
function censorshipDataProcessing(){

    var blockGas: any = {};
    var blockGasFb: any = {};

    var rationalityPreviousBlocks = Array.from({length: 4}, () => 0);
    var rationalityPreviousFbBlocks = Array.from({length: 4}, () => 0);

    var irrationalTransactions = 0;
    var irrationalTransactionsFb = 0;

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

    for(let index = 0;
        index < data.length;
        index++){
            let block = data[index];
            let blockNumber = block["blockNumber"];
            let isFb = block["isFlashBotsBlock"];
            let numOfTxs = block["numOfTxs"];
            if(isFb){
                /**
                * Block gas check for fb/normal
                */
                // blockGasFb[block.gasUsed / 100000] = blockGasFb[block.gasUsed / 100000] ? blockGasFb[block.gasUsed / 100000] + 1 : 1;
                addToDict(blockGasFb, block.gasUsed, 100000);
            }else{
                // blockGas[block.gasUsed / 100000] = blockGas[block.gasUsed / 100000] ? blockGas[block.gasUsed / 100000] + 1 : 1;
                addToDict(blockGas, block.gasUsed, 100000);
            }

           for(let tx of block.transactions){
                /**
                * Counting the rational transactions based on how many blocks back they run
                * Counting the histogram of gas used in each transactions and gathering them inside objects
                * Counting the transactions based on their index
                */
               if(tx.runAtBlock === "0"){
                    if(isFb){
                        //irrational Fb
                        irrationalTransactionsFb += 1
                        addToDict(irrationalTxGasFb, tx.gasUsed, 1000);
                        addToDict(irrationalTxIndexFb * 300 / numOfTxs , tx.index);
                    }else{
                        //irrational
                        irrationalTransactions += 1;
                        addToDict(irrationalTxGas, tx.gasUsed, 1000);
                        addToDict(irrationalTxIndex * 300 / numOfTxs, tx.index);
                    }
               }else{
                    let previousBlocks = blockNumber - parseInt(tx.runAtBlock);
                    for(let p = 1; p <= previousBlocks; p++){
                        let runAtBlockData = data[index - p];
                        if(runAtBlockData){
                            if(runAtBlockData["blockNumber"] !== blockNumber - p){
                                throw new Error(`blocks are not in order block ${runAtBlockData["blockNumber"]} is found instead of ${blockNumber - p}`);
                            }
                            let gasLeft = runAtBlockData.gasLimit - runAtBlockData.gasUsed;
                            if(gasLeft >= tx.gasLimit){
                                if(runAtBlockData["isFlashBotsBlock"] === true){
                                    censorshipAmountFb += 1;
                                }else{
                                    censorshipAmount += 1;
                                }
                                if(isFb){
                                    censorshipFb[p - 1] += 1;
                                }else{
                                    censorship[p - 1] += 1;
                                }
                            }
                        }
                    }
                    if(isFb){
                        //rational Fb
                        rationalityPreviousFbBlocks[previousBlocks] += 1;
                        addToDict(rationalTxGasFb, tx.gasUsed, 1000);
                        addToDict(rationalTxIndexFb * 300 / numOfTxs, tx.index);
                    }else{
                        //rational
                        rationalityPreviousBlocks[previousBlocks] += 1;
                        addToDict(rationalTxGas, tx.gasUsed, 1000);
                        addToDict(rationalTxIndex * 300 / numOfTxs, tx.index);
                    }
               }
           }
    }

    console.log("blockGas ", blockGas);
    console.log("blockGasFb ", blockGasFb);

    console.log("rationalityPreviousBlocks ", rationalityPreviousBlocks)
    console.log("rationalityPreviousFbBlocks ", rationalityPreviousFbBlocks);

    console.log("irrationalTransactions ", irrationalTransactions);
    console.log("irrationalTransactionsFb ", irrationalTransactionsFb);

    console.log("rationalTxGas ", rationalTxGas);
    console.log("irrationalTxGas ", irrationalTxGas);
    console.log("rationalTxGasFb ", rationalTxGasFb)
    console.log("irrationalTxGasFb ", irrationalTxGasFb)

    console.log("rationalTxIndex ", rationalTxIndex);
    console.log("irrationalTxIndex ", irrationalTxIndex);
    console.log("rationalTxIndexFb ", rationalTxIndexFb);
    console.log("irrationalTxIndexFb ", irrationalTxIndexFb);

    console.log("censorship ", censorship);
    console.log("censorshipFb ", censorshipFb);

    console.log("censorshipAmount ", censorshipAmount);
    console.log("censorshipAmountFb ", censorshipAmountFb);

    function addToDict(dict: any,  val: number, factor: number = 1){
        let index = Math.floor(val / factor);
        dict[index] = dict[index] ? dict[index] + 1 : 1;
    }
}

censorshipDataProcessing();