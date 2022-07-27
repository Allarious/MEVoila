import { HardhatUserConfig, task } from "hardhat/config";
import { nodeAPIKey } from "./config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1,
      mining: {
        mempool: {
          order: "fifo"
        }
      },
      forking: {
        url: nodeAPIKey,
      }
    }
  }
};

// This is just to make sure if everything is working correctly when using witht he cli, can be removed later if it is not needed. 
// Overall a handy task to have.
task("balance", "Prints the account balance")
  .addParam("account", "Address of the account")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.account;
    const balance = await hre.ethers.provider.getBalance(address);
    console.log(hre.ethers.utils.formatEther(balance), "ETH");
  })

task("blockNumber", "Prints the most recent block number")
  .setAction(async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(blockNumber);
  })

export default config;
