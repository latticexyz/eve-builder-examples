import {
  ClientConfig,
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  Transport,
  WalletClient,
} from "viem";
import { networkConfig } from "./networkConfig";
import { createBurnerAccount } from "@latticexyz/common";
import { transactionQueue } from "@latticexyz/common/actions";
import { observer } from "@latticexyz/explorer/observer";

const clientOptions = {
  chain: networkConfig.chain,
  transport: http(),
  pollingInterval: 1000,
} as const satisfies ClientConfig;

export const publicClient: PublicClient<Transport, typeof networkConfig.chain> =
  createPublicClient(clientOptions);

const burnerAccount = createBurnerAccount(networkConfig.privateKey);
export const burnerWalletClient: WalletClient<
  Transport,
  typeof networkConfig.chain,
  typeof burnerAccount
> = createWalletClient({
  ...clientOptions,
  account: burnerAccount,
})
  .extend(transactionQueue())
  .extend(observer());
