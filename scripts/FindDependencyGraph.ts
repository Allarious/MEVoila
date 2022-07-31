import { getBlockRawTransactions } from "./getBlockRawTransactions"
import { getBlockTxStatus } from "./getBlockTxStatus";
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { forkFrom } from "./forkFrom";
import { network, ethers } from "hardhat";

export const findDependencyGraphInABlock = async (blockNumber: number, verbose = true) => {

    const { provider } = ethers;

    await network.provider.send("evm_setAutomine", [false]);

    const setupBlockInitialState = async () => {
        if(verbose){
            console.log(`Forking from block ${blockNumber - 1}`);
        }
        await forkFrom(blockNumber - 1);
    }

    const txRaws = await getBlockRawTransactions(blockNumber);
    const txStatus = await getBlockTxStatus(blockNumber);
    const failedTxsList = []

    //Fill the failed txs

    if(txRaws === undefined || txStatus === undefined){
        throw Error("Raw transactions list or status list can not be undefined");
    }

    if(txRaws.length !== txStatus.length){
        throw Error("Raw transacitons list should be equal to the number of status list");
    }

    if(txRaws.length === 0 || txStatus.length === 0){
        return []; // Maybe I need to change the output when I decide what it is
    }

    for(let index = 0; index < txRaws.length; index++){
        //maintain a list of failed transaction that run at a certain index, index == 0 then we have irrational transactions for now
        if(verbose){
            console.log(`Running the first ${index} transactions.`)
        }
        let stateTransaction = txRaws.slice(0, index);
        await loadFixture(setupBlockInitialState);
        for(let txRaw of stateTransaction){
            const output = await provider.send(
                "eth_sendRawTransaction",
                [txRaw]
            );
        }
        await network.provider.send("hardhat_mine", ["0x1"]);
        // call the faied txs until they fail
    }

}