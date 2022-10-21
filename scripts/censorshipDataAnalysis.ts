import data from "../replayData";
import data1 from "../replayData1";
import data2 from "../replayData2";

function analysisAndReport(){
    var map = new Map();
    var irrationalTxNum = 0, rationalTxNum = 0;
    function censorshipDataAnalysis(data: any[]){
        for(let block of data){
            let blockNumber = block.blockNumber;
            for(let txObj of block.data){
                let txReplayBlock = parseInt(
                    (Object.values(txObj)[0] as string)
                )
                if(txReplayBlock === 0){
                    irrationalTxNum++;
                }else{
                    rationalTxNum++;
                    let blockDifference = blockNumber - txReplayBlock;
                    
                    map.set(
                        blockDifference, 
                        map.has(blockDifference) ? map.get(blockDifference) + 1 : 1
                        );
                }
            }
        }
    }

    censorshipDataAnalysis(data);
    dumpData(false);
    censorshipDataAnalysis(data1);
    dumpData(false);
    censorshipDataAnalysis(data2);
    dumpData(false);


    function dumpData(reset = false){
        let allTxs = irrationalTxNum + rationalTxNum;
        console.log(map)
        console.log(irrationalTxNum/allTxs, rationalTxNum/allTxs);
        console.log("All transactions: " + allTxs);
        if(reset){
            map = new Map();
            irrationalTxNum = 0;
            rationalTxNum = 0;
        }
    }
}

analysisAndReport();