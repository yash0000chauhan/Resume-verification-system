require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    hederaTestnet: {
      provider: () =>
        new HDWalletProvider(
          [process.env.PRIVATE_KEY],   // ✅ must be array
          process.env.HEDERA_RPC_URL   // ✅ RPC endpoint
        ),
      network_id: "296",
      gas: 8000000,
      gasPrice: 420000000000
    }
  },

  compilers: {
    solc: {
      version: "0.5.16"
    }
  }
};
