import { expect } from "chai";
import { getBlockTransactions } from "../scripts/getBlockTransactions";
import { blockTransactions } from './testData/blockTransactions';
import { forkFrom } from "../scripts/forkFrom";

describe("getBlockTransactions", function () {

    blockTransactions.forEach((data) => {
        it(`should get the transaction list from block ${data.blockHeight} correctly`, async () => {

            await forkFrom(0)

            const transactions = await getBlockTransactions(data.blockHeight)
            
            expect(transactions).to.eql(
                    data.transactions 
                    )
        })
    })
});
