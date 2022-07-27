import { expect } from 'chai';
import { ethers } from 'hardhat';
import { getRawTransactionByHash } from '../scripts/getRawTransaction';
import { transactionSerializationData } from './testData/transactionSerializationData';
import { forkFrom } from '../scripts/forkFrom';

describe('getRawTransaction', function () {

    const { provider } = ethers;

    this.beforeAll(async () => {
        await forkFrom(0);
    })

    transactionSerializationData.forEach((data) => {
            it(`should serialize transaction ${data.txHash} correctly`, async () => {
                const txRaw = await getRawTransactionByHash(data.txHash);

                expect(txRaw).to.equal(data.txRaw);
            })
        }
    )

})