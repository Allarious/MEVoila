
import { ethers } from "hardhat";

export const getTransactionByHash = async (txHash: string) => {

    const { provider } = ethers

    try{

        const txData = await provider.send("eth_getTransactionByHash", [txHash])

        return txData

    } catch (e: unknown) {

        if (typeof e === "string") {
            e.toUpperCase();
        } else if (e instanceof Error) {
            e.message;
        } else {
            console.log(e);
        }
    }
}