import { expect } from 'chai';
import { ethers } from 'hardhat';
import { forkFrom } from '../scripts/forkFrom';
import { sendRawTransactions } from '../scripts/sendRawTransactions';
import { getBlockRawTransactions } from '../scripts/getBlockRawTransactions';


//Integration test
describe("Fetching and mining a block", function (){
    const { provider } = ethers;

    it("should fetch replay a block", async () => {
        // Going back 50 blocks to make sure the block is not a minor fork is submitted to the system
        const blockNumber = await provider.getBlockNumber() - 50; 
        const txRaws = await getBlockRawTransactions(blockNumber);

        console.log(`the block ${blockNumber}'s transaction count is equal to ${txRaws?.length}`);

        forkFrom(blockNumber - 1);

        console.log(`Forked from blocknumber: ${blockNumber - 1}`);

        if(txRaws === undefined || txRaws.length === 0){
            console.log("EMPTY BLOCK, STOPPING.");
            console.log(`block ${blockNumber} was empty.`);
        } else {
            console.log("Sending the transactions:")
            
            await sendRawTransactions(txRaws, false);

            const newBlockNumber = await provider.getBlockNumber();

            expect(newBlockNumber).to.equal(blockNumber);
            const newRaws = await getBlockRawTransactions(newBlockNumber);
            expect(newRaws).to.eql(txRaws);
            
        }
    })
})


// const blockNumber = 15246326; sender does not have enough?
// 1) Fetching and mining a block
//        should fetch replay a block:
//      InvalidInputError: sender doesn't have enough funds to send tx. The max upfront cost is: 8124992372441452 and the sender's account only has: 27644
//       at TxPool._validateTransaction (node_modules/hardhat/src/internal/hardhat-network/provider/TxPool.ts:447:13)
//       at async TxPool.addTransaction (node_modules/hardhat/src/internal/hardhat-network/provider/TxPool.ts:112:5)
//       at async HardhatNode._addPendingTransaction (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1587:5)
//       at async EthModule._sendTransactionAndReturnHash (node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1504:18)
//       at async HardhatNetworkProvider.request (node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:118:18)
//       at async EthersProviderWrapper.send (node_modules/@nomiclabs/hardhat-ethers/src/internal/ethers-provider-wrapper.ts:13:20)
//       at async sendRawTransactions (scripts/sendRawTransactions.ts:17:24)
//       at async Context.<anonymous> (test/sendBlockOfRawTransactions.test.ts:26:13)