import { ContractFactory, Contract } from "ethers";

import { TransactionSubmitter } from "./TransactionSubmitter";
import {
  deployer,
  networkSuffix,
  initGWAccountIfNeeded,
  isGodwoken,
  getGasPrice,
} from "./common";

import WCKB from "../artifacts/contracts/test/WETH9.sol/WETH9.json";

const deployerAddress = deployer.address;
const txOverrides = {
  gasLimit: isGodwoken ? 500_000 : undefined,
};

async function main() {
  console.log("Deployer Ethereum address:", deployerAddress);

  await initGWAccountIfNeeded(deployerAddress);

  const gasPrice = await getGasPrice();

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
      tx.gasPrice = gasPrice;
      tx.gasLimit = txOverrides.gasLimit;
      return deployer.sendTransaction(tx);
    },
  );
  const wckbAddress = receipt.contractAddress;
  console.log(`    WCKB address:`, wckbAddress);

  const wckb = new Contract(wckbAddress, WCKB.abi, deployer);

  console.log("    WCKB.decimals:", await wckb.callStatic.decimals());
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log("err", err);
    process.exit(1);
  });
