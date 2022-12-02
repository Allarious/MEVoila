import { add } from "nconf";
// import data from "../../censorshipData/censorshipData1";
import data from "../../censorshipData/censorshipData02";
// import data from "../../censorshipData/data";

// console.log("Start of data");
// for(let i = 0; i < data.length - 1; i++){
//     if(data[i]["blockNumber"] != data[i + 1]["blockNumber"] - 1){
//         console.log(data[i]["blockNumber"]);
//     }
// }
// console.log("End of data");
// console.log("Start of data1");
// for(let i = 0; i < data1.length - 1; i++){
//     if(data1[i]["blockNumber"] != data1[i + 1]["blockNumber"] - 1){
//         console.log(data1[i]["blockNumber"]);
//     }
// }
// console.log("end of data1");

/**
 * @dev Processes censorship data for the final data outputs
 */
function censorshipDataProcessing(){

    var blockGas: any = {};
    var blockGasFb: any = {};

    var rationalityPreviousBlocks = Array.from({length: 4}, () => 0);
    var rationalityPreviousFbBlocks = Array.from({length: 4}, () => 0);

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
                addToDict(blockGasFb, block.gasUsed, 100000);
                numberOfTransactionsFb += numOfTxs;
                numberOfFailedTransactionsFb += block.transactions.length;
                overAllGasUsedFb += block.gasUsed;
            }else{
                addToDict(blockGas, block.gasUsed, 100000);
                numberOfTransactions += numOfTxs;
                numberOfFailedTransactions += block.transactions.length;
                overAllGasUsed += block.gasUsed;
            }

            if(numOfTxs === 0){
                continue;
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
                        gasPriceIrrationalFb += tx.gasUsed;
                        addToDict(irrationalTxGasFb, tx.gasUsed, 1000);
                        addToDict(irrationalTxIndexFb, tx.index * 300 / numOfTxs);
                    }else{
                        //irrational
                        irrationalTransactions += 1;
                        gasPriceIrrational += tx.gasUsed;
                        addToDict(irrationalTxGas, tx.gasUsed, 1000);
                        addToDict(irrationalTxIndex, tx.index * 300 / numOfTxs);
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
                        numberOfRationalTransactionsFb += 1;
                        gasPriceRationalFb += tx.gasUsed;
                        addToDict(rationalTxGasFb, tx.gasUsed, 1000);
                        addToDict(rationalTxIndexFb, tx.index * 300 / numOfTxs);
                    }else{
                        //rational
                        rationalityPreviousBlocks[previousBlocks] += 1;
                        numberOfRationalTransactions += 1;
                        gasPriceRational += tx.gasUsed;
                        addToDict(rationalTxGas, tx.gasUsed, 1000);
                        addToDict(rationalTxIndex, tx.index * 300 / numOfTxs);
                    }
               }
           }
    }

    console.log("blockGas: ", blockGas, ",");
    console.log("blockGasFb: ", blockGasFb, ",");

    console.log("rationalityPreviousBlocks: ", rationalityPreviousBlocks, ",")
    console.log("rationalityPreviousFbBlocks: ", rationalityPreviousFbBlocks, ",");

    console.log("irrationalTransactions: ", irrationalTransactions, ",");
    console.log("irrationalTransactionsFb: ", irrationalTransactionsFb, ",");

    console.log("rationalTxGas: ", rationalTxGas, ",");
    console.log("irrationalTxGas: ", irrationalTxGas, ",");
    console.log("rationalTxGasFb: ", rationalTxGasFb, ",")
    console.log("irrationalTxGasFb: ", irrationalTxGasFb, ",")

    console.log("rationalTxIndex: ", rationalTxIndex, ",");
    console.log("irrationalTxIndex: ", irrationalTxIndex, ",");
    console.log("rationalTxIndexFb: ", rationalTxIndexFb, ",");
    console.log("irrationalTxIndexFb: ", irrationalTxIndexFb, ",");

    console.log("censorship: ", censorship, ",");
    console.log("censorshipFb: ", censorshipFb, ",");

    console.log("censorshipAmount: ", censorshipAmount, ",");
    console.log("censorshipAmountFb: ", censorshipAmountFb, ",");

    console.log("numberOfTransactions: ", numberOfTransactions, ",")
    console.log("numberOfTransactionsFb: ", numberOfTransactionsFb, ",");

    console.log("numberOfFailedTransactions: ", numberOfFailedTransactions, ",");
    console.log("numberOfFailedTransactionsFb: ", numberOfFailedTransactionsFb, ",");

    console.log("numberOfRationalTransactions: ", numberOfRationalTransactions, ",");
    console.log("numberOfRationalTransactionsFb: ", numberOfRationalTransactionsFb, ",");

    console.log("overAllGasUsed: ", overAllGasUsed, ",");
    console.log("overAllGasUsedFb: ", overAllGasUsedFb, ",");

    console.log("gasPriceRational: ", gasPriceRational, ",");
    console.log("gasPriceRationalFb: ", gasPriceRationalFb, ",");
    
    console.log("gasPriceIrrational: ", gasPriceIrrational, ",");
    console.log("gasPriceIrrationalFb: ", gasPriceIrrationalFb, ",");

    function addToDict(dict: any,  val: number, factor: number = 1){
        let index = Math.floor(val / factor);
        dict[index] = dict[index] ? dict[index] + 1 : 1;
    }
}

censorshipDataProcessing();