import { ContractFactory } from "ethers";

import { TransactionSubmitter } from "./TransactionSubmitter";
import {
  deployer,
  networkSuffix,
  initGWAccountIfNeeded,
  isGodwoken,
} from "./common";

import YokaiRouter from "../artifacts/contracts/YokaiRouter.sol/YokaiRouter.json";

const deployerAddress = deployer.address;
const txOverrides = {
  gasPrice: isGodwoken ? 0 : undefined,
  gasLimit: isGodwoken ? 12_500_000 : undefined,
};

const { FACTORY_ADDRESS } = process.env;
if (FACTORY_ADDRESS == null) {
  console.log("process.env.FACTORY_ADDRESS is required");
  process.exit(1);
}
const factoryAddress = FACTORY_ADDRESS;

const { WCKB_ADDRESS } = process.env;
if (WCKB_ADDRESS == null) {
  console.log("process.env.WCKB_ADDRESS is required");
  process.exit(1);
}
const wckbAddress = WCKB_ADDRESS;

async function main() {
  console.log("Deployer Ethereum address:", deployerAddress);

  await initGWAccountIfNeeded(deployerAddress);

  const transactionSubmitter = await TransactionSubmitter.newWithHistory(
    `deploy-yokai-router${networkSuffix ? `-${networkSuffix}` : ""}.json`,
    Boolean(process.env.IGNORE_HISTORY),
  );

  const receipt = await transactionSubmitter.submitAndWait(
    `Deploy YokaiRouter`,
    () => {
      const implementationFactory = new ContractFactory(
        YokaiRouter.abi,
        YokaiRouter.bytecode,
        deployer,
      );
      const tx = implementationFactory.getDeployTransaction(
        factoryAddress,
        wckbAddress,
      );
      tx.gasPrice = txOverrides.gasPrice;
      tx.gasLimit = txOverrides.gasLimit;
      return deployer.sendTransaction(tx);
    },
  );
  const yokaiRouterAddress = receipt.contractAddress;
  console.log(`    YokaiRouter address:`, yokaiRouterAddress);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log("err", err);
    process.exit(1);
  });
