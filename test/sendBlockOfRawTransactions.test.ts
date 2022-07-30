import { expect } from 'chai';
import { ethers } from 'hardhat';
import { forkFrom } from '../scripts/forkFrom';
import { sendBlockOfRawTransactions } from '../scripts/sendBlockOfRawTransactions';
import { getBlockRawTransactions } from '../scripts/getBlockRawTransactions';


//Integration test
describe("Fetching and mining a block", function (){
    const { provider } = ethers;

    it("should fetch replay a block", async () => {
        // const blockNumber = await provider.getBlockNumber(); 
        const blockNumber = 15240150;
        const txRaws = await getBlockRawTransactions(blockNumber);
        console.log(txRaws?.length)

        forkFrom(blockNumber - 1);
        console.log(`Forked from blocknumber: ${blockNumber - 1}`)

        if(txRaws === undefined){
            console.log("EMPTY BLOCK, STOPPING.")
            console.log(`block ${blockNumber} was empty.`);
        } else {
            console.log("sending the transactions")
            await sendBlockOfRawTransactions(txRaws);
            console.log(1)
            const newBlockNumber = await provider.getBlockNumber();
            console.log(1)
            console.log(newBlockNumber)
            expect(newBlockNumber).to.equal(blockNumber);
            const newRaws = await getBlockRawTransactions(newBlockNumber);
            expect(newRaws).to.eql(txRaws) ;
        }
    })
})

// getting raw transction of object 0xe67a916252b584e83eef1bc55ab20acf8563fd72e26c580fb39d206daf1257ad
// getting raw transction of object 0x81db3102630ecbe5135e3373c63c2795c3d163faf9bf92232b38332b5b8970d1
// getting raw transction of object 0x43c5c9d0c2a5f51b3cfb3f3e8de41eab2db6358c4e1c69a3e061f0204e0d5a1a
// getting raw transction of object 0x7b715bba3ac9c51f1009059336071287edeb29172376127cd748ff1d7efca92e
// getting raw transction of object 0xe0f58453fba3d2aa5373e45ae4bbaa915912bbcd2fd19a9f31434fcfa8f022f1
// getting raw transction of object 0xf96f4e0fd92aaeea2f21732b88f27f4014b7707f31e4af3dbb9c544041c12b12
// getting raw transction of object 0x3dcd6bbde648f8c410da2cd61266a81449323874b5c1004c2badc3f0591c98e0
// getting raw transction of object 0x0a395718d70860a419c7ebdbe534241005c24b826312008155b33cd1d6df5fa3
// getting raw transction of object 0x3a6081f9f84660e296305885f1aced3fc832d8b07d354bbc5d36fde35dd84bd0
// getting raw transction of object 0x83a6d70098469005151595189f17525560567dd6cdcd4b3a51e2f2005854ef02
// getting raw transction of object 0x7609f30203d672e44f8129f52af62a8e536a04d7382785689c81c1942d5be5c0
// getting raw transction of object 0x940c0707cb91f629923dcb9aab0b248be166ece7030511ba95f05718f6af35b0
// getting raw transction of object 0xfb2a4dde25fc9f79fc80e2292e8cd8a2f0190f1cd1862467857e69e3702bd510
// getting raw transction of object 0x0c2e17e95760e792b6a1a58081863d7bca7027d622698228adeef48930d09acc
// getting raw transction of object 0x78723e21404c86485dfe4069496d6c21b152a5fa2e7e1b6655f70a2b47861807
// getting raw transction of object 0x84621180e88bb867f95e0ce828859aaa547a49bf49ab3993245c3bdc6a0f0bbf
// getting raw transction of object 0x692c3f8b1bb44b28620518ccc4ab23397ae256c3b7ab0e761f8ddb588433c310
// getting raw transction of object 0x08caf2195ed632c1e60bee8b3b28f75397d4deed3a581f720ba3fbb5089cc352