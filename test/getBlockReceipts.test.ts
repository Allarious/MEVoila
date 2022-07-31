import { expect } from "chai";
import { getBlockTxStatus } from "../scripts/getBlockTxStatus";
import { transactionReceipts } from "./testData/transactionsReceipts";

describe("getBlockReceipts", function() {

    transactionReceipts.forEach((data) => {
        it(`should fetch the transaction receipts of ${data.blockHeight} correctly`, async () => {
            const blockStatus = await getBlockTxStatus(15247560);
            expect(blockStatus).to.eql(data.txReceipts);
        })
    })
})    