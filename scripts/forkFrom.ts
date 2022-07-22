import hre from 'hardhat';


// Thanks to cmichel https://cmichel.io/replaying-ethereum-hacks-introduction/
export const forkFrom = async (blockNumber: number) => {
    if(!hre.config.networks.hardhat.forking) {
        throw new Error(
            `Forking misconfigured for "hardhat" network in hardhat.config.ts`
        );
    }

    await hre.network.provider.request({
        method: "hardhat_reset",
        params: [
            {
                forking: {
                    jsonRpcUrl: hre.config.networks.hardhat.forking.url,
                    blockNumber: (blockNumber === 0 ? undefined : blockNumber),
                },
            },
        ],
    });
};