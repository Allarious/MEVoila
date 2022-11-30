import { add } from "nconf";
import data from "../../censorshipData/censorshipData";

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

    for(let index = 0;
        index < data.length;
        index++){
            let block = data[index];
            let blockNumber = block["blockNumber"];
            let isFb = block["isFlashBotsBlock"];
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
                        addToDict(irrationalTxIndexFb, tx.index);
                    }else{
                        //irrational
                        irrationalTransactions += 1;
                        addToDict(irrationalTxGas, tx.gasUsed, 1000);
                        addToDict(irrationalTxIndex, tx.index);
                    }
               }else{
                    let previousBlocks = blockNumber - parseInt(tx.runAtBlock);
                    if(isFb){
                        //rational Fb
                        rationalityPreviousFbBlocks[previousBlocks] += 1;
                        addToDict(rationalTxGasFb, tx.gasUsed, 1000);
                        addToDict(rationalTxIndexFb, tx.index);
                    }else{
                        //rational
                        rationalityPreviousBlocks[previousBlocks] += 1;
                        addToDict(rationalTxGas, tx.gasUsed, 1000);
                        addToDict(rationalTxIndex, tx.index);
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




    function addToDict(dict: any,  val: number, factor: number = 1){
        let index = Math.floor(val / factor);
        dict[index] = dict[index] ? dict[index] + 1 : 1;
    }
}

censorshipDataProcessing();