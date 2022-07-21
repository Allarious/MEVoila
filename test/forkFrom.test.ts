import { expect } from 'chai';
import hre, { ethers } from 'hardhat';
import { forkFrom } from '../scripts/forkFrom';

// 6792847566974659910547 15188070 f2pooleth 0x829BD824B016326A401d083B33D092293333A830
// 17306757562173843129636 15188094 hiveonpool 0x1aD91ee08f21bE3dE0BA2ba6918E714dA6B45836

describe("forkFrom", function () {
    const { BigNumber, provider} = ethers;

    it("Should form a block 15188070 and report f2pooleth balance right", async () => {

        await forkFrom(15188070);

        const f2poolethBalance = await provider.getBalance(
                "0x829BD824B016326A401d083B33D092293333A830"
                );

        expect(f2poolethBalance).to.equal(
            BigNumber.from(
                "6792847566974659910547"
                )
            );
    })

    it("Should form a block 15188094 and report hiveonpool balance right", async () => {

        await forkFrom(15188094);

        const hiveonpoolBalance = await provider.getBalance(
                "0x1aD91ee08f21bE3dE0BA2ba6918E714dA6B45836"
                );

        expect(hiveonpoolBalance).to.equal(
            BigNumber.from(
                "17306757562173843129636"
                )
            );
    }) 
})