import { ethers } from 'hardhat';

export const getBlock = async (blockNumber: number) => {
    const { provider } = ethers

    try {

        const blockData = await provider.getBlock(blockNumber)
        return blockData

    } catch (e: unknown) {

        if (typeof e === "string") {
            e.toUpperCase()
        } else if (e instanceof Error) {
            e.message
        } else {
            console.log(e)
        }

    }
}