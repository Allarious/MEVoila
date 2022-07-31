import { ethers } from "hardhat";
import { getBlockTransactions } from "./getBlockTransactions";

export const getBlockTxStatus = async (blockNumber: number) => {

    const { provider } = ethers

    try{

        const blockTxs = await getBlockTransactions(blockNumber);

        if(blockTxs === undefined || blockTxs.length === 0){
            return []
        }

        let blockReceipts = []

        for(const tx of blockTxs){
            const txReceipt = await provider.send("eth_getTransactionReceipt", [tx]);
            blockReceipts.push(txReceipt.status);
        }

        return blockReceipts

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