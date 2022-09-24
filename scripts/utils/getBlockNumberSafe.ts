import hre from 'hardhat';

export default async function(requrestedBlock: number){
    const currentBlock = await hre.ethers.provider.getBlockNumber();
    if(requrestedBlock > currentBlock){
        throw Error(
            `The requested block is not reached yet. Requested block: ${requrestedBlock}, current block: ${currentBlock}`
            );
    }
}