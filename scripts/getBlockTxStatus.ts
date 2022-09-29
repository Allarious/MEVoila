import { ethers } from "hardhat";
import { getBlockTransactions } from "./getBlockTransactions";

export const getBlockTxStatus = async (blockNumber: number, blockTxs: string[] | undefined = undefined) => {

    const { provider } = ethers

    try{
        if(!blockTxs){
            blockTxs = await getBlockTransactions(blockNumber);
        }

        if(blockTxs === undefined || blockTxs.length === 0){
            return []
        }

        let blockReceipts = []

        for(const tx of blockTxs){
            try{
                const txReceipt = await provider.send("eth_getTransactionReceipt", [tx]);
                blockReceipts.push(txReceipt.status);
            }catch{
                console.log(`WARNING: Transaction receipt thrown an error, transactions hash is ${tx}`);
                // Skip the transaction
                blockReceipts.push("0x1")
            }
        }

        return blockReceipts

    } catch (e: unknown) {
        console.log(e);
        if (typeof e === "string") {
            e.toUpperCase();
        } else if (e instanceof Error) {
            e.message;
        } else {
            console.log(e);
        }
    }

} 