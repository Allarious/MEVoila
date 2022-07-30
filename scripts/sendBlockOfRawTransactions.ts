import { network, ethers } from 'hardhat';

export const sendBlockOfRawTransactions = async (txRaws: string[], autoMine = true,verbose = true) => {

    await network.provider.send("evm_setAutomine", [autoMine]);

    let counter = 0;
    await txRaws.forEach(async (txRaw: string) => {
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
            console.log(`Transaction with hash ${output} is included`);
        }
    })

    // console.log("going to get pending transactions ...")
    // const pendingBlock = await network.provider.send("eth_getBlockByNumber", [
    //     "pending",
    //     false,
    //   ]);
    // console.log("PenDDDDDDING")      
    // console.log(pendingBlock)

    // console.log("Going to mine");
    if(autoMine){
        await network.provider.send("hardhat_mine", ["0x1"]);
    }
    // await network.provider.send("evm_setAutomine", [true]);
    console.log("Mining Finished");
}