import { ContractFactory } from "ethers";

import { TransactionSubmitter } from "./TransactionSubmitter";
import {
  deployer,
  networkSuffix,
  initGWAccountIfNeeded,
  isGodwoken,
} from "./common";

import WCKB from "../artifacts/contracts/test/WETH9.sol/WETH9.json";

const deployerAddress = deployer.address;
const txOverrides = {
  gasPrice: isGodwoken ? 0 : undefined,
  gasLimit: isGodwoken ? 12_500_000 : undefined,
};

async function main() {
  console.log("Deployer Ethereum address:", deployerAddress);

  await initGWAccountIfNeeded(deployerAddress);

  const transactionSubmitter = await TransactionSubmitter.newWithHistory(
    `deploy-wrapped-ckb${networkSuffix ? `-${networkSuffix}` : ""}.json`,
    Boolean(process.env.IGNORE_HISTORY),
  );

  const receipt = await transactionSubmitter.submitAndWait(
    `Deploy WCKB`,
    () => {
      const implementationFactory = new ContractFactory(
        WCKB.abi,
        WCKB.bytecode,
        deployer,
      );
      const tx = implementationFactory.getDeployTransaction();
      tx.gasPrice = txOverrides.gasPrice;
      tx.gasLimit = txOverrides.gasLimit;
      return deployer.sendTransaction(tx);
    },
  );
  const wckbAddress = receipt.contractAddress;
  console.log(`    WCKB address:`, wckbAddress);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log("err", err);
    process.exit(1);
  });
