import { network, ethers } from 'hardhat';

export const sendRawTransactions = async (txRaws: string[], singleTransactionABlock = true,verbose = false) => {

    const autoMine = singleTransactionABlock;

    await network.provider.send("evm_setAutomine", [autoMine]);

    let counter = 0;
    for(const txRaw of txRaws){
    // await txRaws.forEach(async (txRaw: string) => {
        counter += 1;
        if(verbose){
            console.log(`sending raw transaction ${txRaw}`);
            console.log(`transaction ${counter}`)
        }
        const output = await ethers.provider.send(
            "eth_sendRawTransaction",
            [txRaw]
        );
        if(verbose){
            console.log(`Transaction with hash ${output} is included with ${counter}`);
        }
    // })
    }

    if(verbose){
        console.log("Mining is about to start...");
    }
    if(!autoMine){
        await network.provider.send("hardhat_mine", ["0x1"]);
    }
    if(verbose){
        console.log("Mining Finished");
    }
}