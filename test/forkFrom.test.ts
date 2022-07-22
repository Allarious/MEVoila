import { expect } from 'chai';
import { ethers } from 'hardhat';
import { forkFrom } from '../scripts/forkFrom';
import { accountBalance } from './testData/accountBalance';

describe("forkFrom", function () {
    const { BigNumber, provider} = ethers;
    const testData = accountBalance;

    testData.forEach((data) => {
        it(`Should form a block ${data.blockHeight} and report ${data.name} balance right`, async () => {

            await forkFrom(data.blockHeight);
    
            const f2poolethBalance = await provider.getBalance(
                    data.account
                    );
    
            expect(f2poolethBalance).to.equal(
                BigNumber.from(
                    data.balance
                    )
                );
        }) 
    });
});