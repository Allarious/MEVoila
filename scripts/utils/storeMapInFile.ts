import fs from 'fs';

export default async function storeMapInFilep(map: Map<string, string>, fileName: string, preStr = ""){
  await appendToFile(`{\n ${preStr}\n"data" : [\n`, fileName);
  let count = 0;
  for(let [key, value] of map){
    await appendToFile(`{"${key}": "${value}"}${++count !== map.size ? "," : ""}\n`, fileName);
  }
  await appendToFile("],\n},\n", fileName);
}

async function appendToFile(data: string, fileName: string) {
  fs.appendFileSync(fileName, data);
}