import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "@symfoni/hardhat-react";
import "@typechain/hardhat";
import "@typechain/ethers-v5";
import "solidity-coverage";

dotenv.config();
const { DEPLOYER_PRIVATE_KEY, INFURA_PROJECT_ID } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address, await (await account.getBalance()).toString());
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  react: {
    providerPriority: ["web3modal", "hardhat"],
    fallbackProvider: "hardhat",
    providerOptions: {
      walletconnect: {
        options: {
          infuraId: INFURA_PROJECT_ID,
        },
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
      inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
      },
    },
    mainnet: {
      url:
        INFURA_PROJECT_ID !== undefined
          ? `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
          : "",
      accounts:
        DEPLOYER_PRIVATE_KEY !== undefined ? [`0x${DEPLOYER_PRIVATE_KEY}`] : [],
    },
    ropsten: {
      url:
        INFURA_PROJECT_ID !== undefined
          ? `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`
          : "",
      accounts:
        DEPLOYER_PRIVATE_KEY !== undefined ? [`0x${DEPLOYER_PRIVATE_KEY}`] : [],
    },
    rinkeby: {
      url:
        INFURA_PROJECT_ID !== undefined
          ? `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`
          : "",
      accounts:
        DEPLOYER_PRIVATE_KEY !== undefined ? [`0x${DEPLOYER_PRIVATE_KEY}`] : [],
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts:
        DEPLOYER_PRIVATE_KEY !== undefined ? [`0x${DEPLOYER_PRIVATE_KEY}`] : [],
    },
  },
  namedAccounts: {
    deployer: 0,
    cokeAdmin: 1,
    pepsiAdmin: 2,
    unknownUser: 3,
    newWhitelistUser: 4,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;
