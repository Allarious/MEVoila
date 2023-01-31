import { ethers } from "hardhat";
import { findDependencyGraphInABlock } from "./FindDependencyGraph";
import { forkFrom } from "./forkFrom";
import { getBlockTransactions } from "./getBlockTransactions";
import fs from 'fs';

export const FindDependancyGraphInBlockchain = async function (interval : number[]) {
    let previousBlockNumber = 0;

    var [startBlock, endBlock] = interval;
    // while(true){
    for(let blockNumber = startBlock;
        blockNumber < endBlock;
        blockNumber++){

        let start = Date.now()
        await forkFrom(0);
        // await forkFrom(0);

        // const currentBlockNumber: number = await ethers.provider.getBlockNumber();
        // const blockNumber: number = currentBlockNumber - 50;

        // if(blockNumber === previousBlockNumber){
        //     await delay(5000);
        //     continue;
        // }

        // previousBlockNumber = blockNumber;

        const txHashes = await getBlockTransactions(blockNumber);
        const numOfTransactions = txHashes?.length;

        const fileName = "dataDependency.js";

        console.log(`Finding the dependancy graph in block ${blockNumber}...`);
        let dependancyGraph;
        try{
            dependancyGraph = await findDependencyGraphInABlock(blockNumber);
        }catch{
            console.log(`skipping block ${blockNumber}`);
            continue;
        }
        console.log(`Found the dependancy graph.`)
        let end = Date.now()
        let runningTime = end - start;
        console.log(`Finding the dependency graph of block ${blockNumber} with ${numOfTransactions} took ${runningTime} milliseconds`);
        console.log(dependancyGraph);
        if(dependancyGraph === undefined){
            continue;
        }
        await appendToFile(fileName, `{\n"time": ${runningTime},\n"blockNumber": ${blockNumber}, \n"numOfTransactions": ${numOfTransactions},\n"data" : [` )
        await delay(500)
        dependancyGraph.forEach(async (value, key) => {
            await appendToFile(fileName, "{\n" + '"' + key + '"' + " : " + '"' + value + '"' + ",\n" + "},\n") ;
        })
        await delay(500)
        await appendToFile(fileName, "]},\n")
    }
}

const appendToFile = async (fileName: string, data: any) => {
    await fs.appendFile(fileName, data, function (err) {
        if (err) throw err;
      });
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


FindDependancyGraphInBlockchain([15000000, 15500000]);
//We should try going back a couple blocks too, since a block can be mined by a certain miner that filters transactions

// '0x65b2052951db15f3354075abefab1ccd00570c88441c2fcdda557d2ef741faa0' => 0,
// '0xbe66c976f34491732f2834bc647657fd35aaee8fcd06384417180bafb09cdd71' => 0,
// '0x9ad984ddaf54fda131139feb67b1f3cd5fe3c7bd85d9a27ddd82ed3f5bf4f2b1' => 0,
// '0xf1b1a1891402601c7a6a5d70856a7774e2b37ef739f4286ff69102373b05c81d' => 0,
// '0xd991a4480c7c877fc9dd77b692c77eb7841a81f4221bd28950d8b6a530312f92' => 0,
// '0x05c8470ffe22e0a5f7fe52bac8536af30394186941053dde7f13bff901d994fd' => 0,
// '0x2c965437b3c88ac3502db7be48c6d08265db98ef0c21b7921036f9bf2c4c523b' => 0,
// '0xac625a80f2e197eca234839b7be963cb0bd00324cafedd1d1d71173a0df64822' => '0x1bf6c77b0b3b6f21129862df68ccd7f47d088e1b706fc112f163978d193c3663'


// 15272177
// '0x6d851026f9043b4e3fca7abfb2c026c968391805dc673610af62cf1632bb5b2e' => 0,
// '0xc9531ba8233a3f8d6f6178547b1f8176b9d55e5a83f2d003b73ca20eb683f16f' => 0,
// '0x6b573003b7ef3eaa014f3fe06b42683972d8b32ca5c3c682c53f7569df1012ad' => 0,
// '0xe68e8aa2a2300684c206c4c8e30b7d5d621083e0504798b27b6a0442076d80d7' => '0xb63d44bacfc0029a550710dad340d92dc8d9e9450d90d16a510e905a924d4b6e',
// '0xf8200eba25824629b6cc40e9cf5ec3078cf16a7bffea965e45460a9e7adf8ba7' => '0xb63d44bacfc0029a550710dad340d92dc8d9e9450d90d16a510e905a924d4b6e',
// '0x31b9a35d206adab4cc346f68cc1d745f64b9c15623f49ccb883b0e37f1b00408' => '0xffd0ec80ac3cfecdc1f370efe8ea039b893c5141d365557129d4342431de88c1',
// '0x0a27a7eb2d9cef32db0898867be580881c5acc0802ba68a9ace48d5dfe6f4eb3' => '0x990316021fc7250c653b1c4828bd5c8d127395ae579102eeb53e0980bad8c913',
// '0xe39a3bfa9904b8134de8d75973262f2e100f1e70e71734d18d8f86a713ce6eaa' => '0x5e74cce772acde0fb02f6318eb9df81f436e3db17eebc28f04081b14f74a9b4a'


/**
 * Errorm rerunning the program...
Error HH601: Script scripts/dataAnalysis/storeDependacyGraphByBlockNumber.ts doesn't exist.
For more info go to https://hardhat.org/HH601 or run Hardhat with --show-stack-traces
Errorm rerunning the program...
Error HH601: Script scripts/dataAnalysis/storeDependacyGraphByBlockNumber.ts doesn't exist.
For more info go to https://hardhat.org/HH601 or run Hardhat with --show-stack-traces
Errorm rerunning the program...
Error HH601: Script scripts/dataAnalysis/storeDependacyGraphByBlockNumber.ts doesn't exist.
For more info go to https://hardhat.org/HH601 or run Hardhat with --show-stack-traces
Errorm rerunning the program...
Error HH601: Script scripts/dataAnalysis/storeDependacyGraphByBlockNumber.ts doesn't exist.
For more info go to https://hardhat.org/HH601 or run Hardhat with --show-stack-traces
Errorm rerunning the program...
Error HH601: Script scripts/dataAnalysis/storeDependacyGraphByBlockNumber.ts doesn't exist.
For more info go to https://hardhat.org/HH601 or run Hardhat with --show-stack-traces
Errorm rerunning the program...
Error HH601: Script scripts/dataAnalysis/storeDependacyGraphByBlockNumber.ts doesn't exist.
For more info go to https://hardhat.org/HH601 or run Hardhat with --show-stack-traces
Errorm rerunning the program...
^C

 */