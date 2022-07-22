import { expect } from "chai";
import { ethers } from "hardhat";
import { getBlockTransactions } from "../scripts/getBlockTransactions";
import { blockTransactions } from './testData/blockTransactions';
import { forkFrom } from "../scripts/forkFrom";

describe("getBlockTransactions", function () {

    const { provider } = ethers;

    blockTransactions.forEach((data) => {
        
        this.beforeAll(async () => {
            // Reset the head to the latest block
            await forkFrom(0);
        })

        it(`should get the transaction list from block ${data.blockHeight} correctly`, async () => {

            const transactions = await getBlockTransactions(data.blockHeight);

            expect(transactions).to.eql(
                    data.transactions,
                    `fetched transactions of block ${data.blockHeight} are not the same as stored data`
                    );
        })
        
        it("should not get the transaction list from a block ahead of its time", async () => {

            // adding a number so we are sure the block is in the future and the results are consistant 
            const futureBlock = await provider.getBlockNumber() + 100;

            const futureBlockData = await getBlockTransactions(
                futureBlock
                );

            expect(
                futureBlockData,
                "transactions of a future block should be undefined"
                ).to.be.undefined;
        })
    })
});
