import { HardhatUserConfig } from "hardhat/config";
import { nodeAPIKey } from "./config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
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

export default config;
