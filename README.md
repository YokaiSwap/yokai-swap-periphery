# YokaiSwap Periphery

## Local Development

The following assumes the use of `node@>=14`.

### Install Dependencies

```
yarn install
```

### Compile Contracts

Link [`yokai-swap-core`](https://github.com/YokaiSwap/yokai-swap-core) frist.

```sh
cd $PATH_TO_YOKAISWAP_CORE
yarn link
cd -
yarn link yokai-swap-core

yarn compile
```

## Deployment

### Prerequisites

You need to deploy [YokaiSwap Core](https://github.com/YokaiSwap/yokai-swap-core) frist.

### Setup

Create a `.env` file, remember to replace placeholders with real value.

```sh
cat > .env <<EOF
DEPLOYER_PRIVATE_KEY=< replace with your private key >
RPC_URL=< polyjuice web3 rpc >
NETWORK_SUFFIX=< gw-testnet or gw-mainnet >

ROLLUP_TYPE_HASH=< replace with godwoken rollup type hash >
ETH_ACCOUNT_LOCK_CODE_HASH=< replace with godwoken eth-account-lock code hash >

FACTORY_ADDRESS=< replace with deployed yokai factory contract address >
WCKB_ADDRESS=< replace with wckb contract address >
EOF
```

### Deploy

Then compile and deploy.

```sh
yarn compile
yarn deploy
```
