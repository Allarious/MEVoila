import data from '../data';
import { getTransactionByHash } from './getTransactionByHash';

console.log(`${data.length} blocks were processed...`);

// let sth = data[4].data ? console.log(Object.values(data[4].data[0])) : undefined;

export const dataAnalysis = async () => {
    let allFailedTx = 0;
    let rationalFailedTx = 0;
    let irrationalFailedTx = 0;
    
    let map = new Map();
    let irMap = new Map();
    let rMap = new Map();

    for(let i = 0; i < data.length; i++){
        console.log(`block ${i}`);
        let numOfTx = data[i].numOfTransactions;
        if(!numOfTx){
            continue;
        }
        if(data && data[i] && data[i].data){
            let len = data[i].data?.length;
            if(len === undefined){
                continue;
            }
            for(let j = 0; j < len; j++){
                let key = Object.keys(data[i].data![j])[0];
                let value = Object.values(data[i].data![j])[0];

                let txData = await getTransactionByHash(key);
                let txIndex = Math.floor((parseInt(txData.transactionIndex, 16)/numOfTx) * 100);

                allFailedTx++;
                if(value === "0"){
                    irrationalFailedTx++;
                    if(irMap.has(txIndex)){
                        irMap.set(txIndex, irMap.get(txIndex) + 1);
                    }else{
                        irMap.set(txIndex, 1);
                    }
                }else{
                    rationalFailedTx++;
                    if(rMap.has(txIndex)){
                        rMap.set(txIndex, rMap.get(txIndex) + 1);
                    }else{
                        rMap.set(txIndex, 1);
                    }
                }

                if(map.has(txIndex)){
                    map.set(txIndex, map.get(txIndex) + 1);
                }else{
                    map.set(txIndex, 1);
                }

            }
        }
    }

    console.log("map")
    console.log(map)
    console.log("irMap")
    console.log(irMap)
    console.log("rMap")
    console.log(rMap)

    console.log(`allfailed tx: ${allFailedTx}, rational: ${rationalFailedTx}, irrational: ${irrationalFailedTx}, proportion: ${rationalFailedTx/allFailedTx}`);

}

dataAnalysis()

// let map = new Map();
// map.set(2, 1);
// map.set(10, 5);
// map.set(1, 6);

// console.log(map);
// var mapAsc = new Map([...map].sort())
// console.log(mapAsc)