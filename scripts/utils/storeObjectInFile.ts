import fs from 'fs';

export default async function storeObjectInFile(obj: any, fileName: string){
  await appendToFile(`{\n`, fileName);
  let count = 0;
  let keys : string[] = Object.keys(obj);
  for(let key of keys){
    await appendToFile(`"${key}": "${obj[key]}"${++count !== keys.length ? "," : ""}\n`, fileName);
  }
  await appendToFile("},\n", fileName);
}

async function appendToFile(data: string, fileName: string) {
  fs.appendFileSync(fileName, data);
}