import { expect } from 'chai';
import { ethers } from 'hardhat';
import { forkFrom } from '../scripts/forkFrom';
import { sendSingleTransaction } from '../scripts/sendSingleTransaction';
import { getBlockTransactions } from '../scripts/getBlockTransactions';
import { getRawTransactionByHash } from '../scripts/getRawTransactionByHash';
import { transactionData } from './testData/transactionData';

describe("sendSingleTransaction", function() {
    const { provider } = ethers;

    transactionData.forEach((data) => {
        it("should send a transaction and mine a block on local chain", async () => {

            const txRaw = await getRawTransactionByHash(data.txHash);

            forkFrom(data.blockHeight - 1);

            await sendSingleTransaction(txRaw);
            const txs = await getBlockTransactions(data.blockHeight);

            expect(txs).to.eql([data.txHash]);
        })
    })
})