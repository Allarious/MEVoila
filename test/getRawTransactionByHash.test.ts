import { expect } from 'chai';
import { getRawTransactionByHash } from '../scripts/getRawTransactionByHash';
import { transactionSerializationData } from './testData/transactionSerializationData';
import { forkFrom } from '../scripts/forkFrom';

describe('getRawTransaction', function () {

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

//TODO add more tests and test serialize and getTransactionByHash independently
//TODO Add a test to check the latest block too