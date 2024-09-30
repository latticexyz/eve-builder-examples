import { getContract, GetContractReturnType } from "viem";
import { networkConfig } from "./networkConfig";
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import { burnerWalletClient, publicClient } from "./clients";

export const worldContract: GetContractReturnType<
  typeof IWorldAbi,
  typeof burnerWalletClient
> = getContract({
  address: networkConfig.worldAddress,
  abi: IWorldAbi,
  client: { public: publicClient, wallet: burnerWalletClient },
});
