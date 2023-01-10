import data0 from '../../logData/fractions/logData0';
import data1 from "../../logData/fractions/logData00";
import data2 from "../../logData/fractions/logData1";
import data3 from "../../logData/fractions/logData01";
import data4 from "../../logData/fractions/logData2";
import data5 from "../../logData/fractions/logData02";


function mergeObjects(...objects : any[]){
    var keys = getKeysOfObjects(...objects);
    var obj: any = {};
    for(let key of keys){
        for(let object of objects){
            if(typeof object[key] === "number"){
                obj[key] = obj[key] ? obj[key] + object[key] : object[key];
            }else{
                if(!obj[key]) obj[key] = {};
                // let childKeys = Object.keys(object[key]);
                // for(let childKey of childKeys){
                //     obj[key][childKey] = obj[key][childKey] ? obj[key][childKey] + object[key][childKey] : object[key][childKey];
                // }
                for(let tuple of object[key]){
                    let [tupleKey, tupleVal] = tuple;
                    obj[key][tupleKey] = obj[key][tupleKey] ? obj[key][tupleKey] + tupleVal : tupleVal;
                }
            }
        }
    }
    console.log(obj);
}

function getKeysOfObjects(...objects : any[]){
    var keys: any[] = [];
    for(let object of objects){
        keys = keys.concat(Object.keys(object));
    }
    return Array.from(new Set(keys));
}

mergeObjects(data0, data1, data2, data3, data4, data5);