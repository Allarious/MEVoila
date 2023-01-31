import { getBlockRawTransactions } from "./getBlockRawTransactions"
import { getBlockTxStatus } from "./getBlockTxStatus";
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { forkFrom } from "./forkFrom";
import { network, ethers } from "hardhat";
import { getBlockTransactions } from "./getBlockTransactions";
import { getTransactionByHash } from "./getTransactionByHash";

export const findDependencyGraphInABlock = async (blockNumber: number, verbose = true) => {

    const { provider } = ethers;

    const setupBlockInitialState = async () => {
        if(verbose){
            console.log(`Forking from block ${blockNumber - 1}`);
        }
        await forkFrom(blockNumber - 1);
        if(verbose){
            console.log("Forking is finished.")
        }
    }

    if(verbose){
        console.log(`Getting Block ${blockNumber}'s raw transactions.`)
    }
    let txRaws = await getBlockRawTransactions(blockNumber);
    if(verbose){
        console.log(`Received Raw transactions DONE.`)
        console.log(`Getting Block ${blockNumber}'s transaction's hashes.`)
    }
    const txHashes = await getBlockTransactions(blockNumber);
    if(verbose){
        console.log(`Received hashes DONE.`)
        console.log(`Getting Block ${blockNumber}'s transaction's Statuses.`)
    }
    const txStatus = await getBlockTxStatus(blockNumber);
    if(verbose){
        console.log(`Received statuses DONE.`)
        console.log("Going into transactions replay phase.")
    }
    let failedTxObjects = []


    if(txRaws === undefined || txStatus === undefined){
        throw Error("Raw transactions list or status list can not be undefined");
    }

    if(txRaws.length !== txStatus.length){
        throw Error("Raw transacitons list should be equal to the number of status list");
    }

    if(txRaws.length === 0 || txStatus.length === 0){
        return []; // Maybe I need to change the output when I decide what it is
    }

    if(txHashes === undefined){
        throw Error("hash should not be empty");
    }


    for(let i = 0; i < txStatus.length; i++){
        if(txStatus[i] === "0x0"){
            failedTxObjects.push(await getTransactionByHash(txHashes[i]));
        }
    }

    //These should go elsewhere
    for(let failedTx of failedTxObjects){
        failedTx.gasPrice = undefined;
        failedTx.data = failedTx.input
    }

    if(verbose){
    console.log(failedTxObjects)
    }
    let hash = new Map();

    let data = []
    for(let index = 0; index < txRaws.length; index++){
        //maintain a list of failed transaction that run at a certain index, index == 0 then we have irrational transactions for now
        if(verbose){
            console.log(`Rebuilding last block's state, Block ${blockNumber - 1}.`)
        }
        await loadFixture(setupBlockInitialState);
        if(verbose){
            console.log(`Running first ${index} transactions.`)
        }

        // This shouldnt be needed evertime, forkfrom has some problems that needs fixing.
        await network.provider.send("evm_setAutomine", [false]);

        for(let i = 0; i < index; i++){
            const output = await provider.send(
                "eth_sendRawTransaction",
                [txRaws[i]]
            );
            // if(verbose){
            //     console.log(`Transaction with index ${i + 1}, and hash ${output} is now in mempool.`);
            // }
        }

        if(verbose){
            console.log("Mining pending transactions.");
        }

        await network.provider.send("hardhat_mine", ["0x1"]);

        if(verbose){
            console.log(await provider.getBlockNumber());
            console.log("Mining Finished.");
        }
        // call the faied txs until they fail
        var newFailed: any[] = [];
        for(let failedTx of failedTxObjects){
            try{
                const out = await provider.send("eth_call", [failedTx]);
                if(verbose){
                    console.log(out);
                }
                newFailed.push(failedTx)
            } catch {
                data.push([failedTx.hash, index])
                if(index === 0){
                    hash.set(failedTx.hash, 0);
                } else {
                    hash.set(failedTx.hash, txHashes[index - 1]);
                }
            }
        }
        failedTxObjects = newFailed;
        if(failedTxObjects.length === 0){
            break
        }
    }

    if(failedTxObjects.length > 0){
        // throw Error("Failed transactions are still in queue, something bad happened!");
        console.log("Failed transactions are still in queue, something bad happened!");
    }
    if(failedTxObjects.length > 1){
        throw Error("Failed transactions are still in queue, something bad happened!");
        // console.log("Failed transactions are still in queue, something bad happened!");
    }
    // console.log(hash);
    return hash
}

//FIRST BLOCK
// findDependencyGraphInABlock(15257561) 
// Same contracts
// 0x876cfe29c760d0f8f3463a1ffaed61ff27fefb83a46740fa5d729e3b76b2c4a5' => '0xb08a81ea0a5e1465cc10e29fd25ae32d6b40472814a8a485badd05c9ee7e5c0a'


// findDependencyGraphInABlock(15271751);
// 0x4a93fc031ebeab0b2c444f28d0944699dbf4133f2f306f69ee5030cc725ffa07' => '0x7a43b560257da942ca683924a036045847f1ec8e76fae3b3ab65f06997899a4e'

// findDependencyGraphInABlock(15271830);
// '0xc87921f523f04630f2d5be146a31eabe567e8cded561afd0232af61973f06fe8' => '0x6355d48162fd9b17a172de8e915a2709d8ed152a3d5b595678504343735f5126',
// '0x0ac7cf038c56e2871519a97b36d2ea1ecb0ddd168dc076cff78775985c71d958' => '0x07192f2ec1047c7bc377035e3059e1d3bce6f9b00cc80860ee5940ddd8236fd8'