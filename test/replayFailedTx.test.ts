import { expect } from 'chai';
import hre from 'hardhat';

import { forkFrom } from '../scripts/forkFrom';
import { replayFailedTx } from '../scripts/replayFailedTx';

describe('test replayFailedTx', () => {
    before(async () => {
        forkFrom(0);
    })

    it('Should be able to run a block', async () => {
        await replayFailedTx(15341704, 3, true);
    })
})