import { network, ethers } from 'hardhat';

export const sendBlockOfRawTransactions = async (txRaws: string[]) => {

    await network.provider.send("evm_setAutomine", [false]);

    await txRaws.forEach(async (txRaw: string) => {
        const output = await ethers.provider.send(
            "eth_sendRawTransaction",
            [txRaw]
        );
    })

    await network.provider.send("hardhat_mine", ["0x1"]);
}