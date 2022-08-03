import { getBlockRawTransactions } from "./getBlockRawTransactions"
import { getBlockTxStatus } from "./getBlockTxStatus";
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { forkFrom } from "./forkFrom";
import { network, ethers } from "hardhat";
import { getBlockTransactions } from "./getBlockTransactions";
import { getTransactionByHash } from "./getTransactionByHash";

export const findDependencyGraphInABlock = async (blockNumber: number, verbose = true) => {

    const { provider } = ethers;

    await network.provider.send("evm_setAutomine", [false]);

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

    // console.log(failedTxObjects)
    let hash = new Map();

    // txRaws = txRaws.slice(4, txRaws.length)
    for(let index = 0; index < txRaws.length; index++){
        //maintain a list of failed transaction that run at a certain index, index == 0 then we have irrational transactions for now
        if(verbose){
            console.log(`rebuilding last block's state, Block ${blockNumber - 1}.`)
        }
        await loadFixture(setupBlockInitialState);
        if(verbose){
            console.log(`Running first ${index} transactions.`)
        }
        for(let i = 0; i < index; i++){
            const output = await provider.send(
                "eth_sendRawTransaction",
                [txRaws[i]]
            );
        }

        if(verbose){
            console.log("Mining pending transactions.");
        }
        await network.provider.send("hardhat_mine", ["0x1"]);
        if(verbose){
            console.log("Mining Finished.");
        }
        // call the faied txs until they fail
        var newFailed: any[] = [];
        for(let failedTx of failedTxObjects){
            newFailed = []

            //These should go elsewhere
            failedTx.gasPrice = undefined;
            failedTx.data = failedTx.input

            try{
                const out = await provider.send("eth_call", [failedTx]);
                console.log(out);
                newFailed.push(failedTx)
            } catch {
                hash.set(failedTx.hash, index)
            }
        }
        failedTxObjects = newFailed;
        if(failedTxObjects.length === 0){
            break
        }
    }

}

findDependencyGraphInABlock(15257561)
// findDependencyGraphInABlock(15257700)