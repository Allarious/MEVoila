import { expect } from 'chai';
import { ethers } from 'hardhat';
import { forkFrom } from '../scripts/forkFrom';
import { accountBalance } from './testData/accountBalance';

describe("forkFrom", function () {
    const { BigNumber, provider} = ethers;

    accountBalance.forEach((data) => {
        it(`Should form a block ${data.blockHeight} and report ${data.name} balance right`, async () => {

            await forkFrom(data.blockHeight);
    
            const balance = await provider.getBalance(
                    data.account
                    );
    
            expect(balance).to.equal(
                BigNumber.from(
                    data.balance
                    ),
                    `fetched balance of account ${data.blockHeight} does not match the stored data`
                );
        }) 
    });
});