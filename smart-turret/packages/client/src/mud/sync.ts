import {
  syncToStash,
  SyncToStashResult,
} from "@latticexyz/store-sync/internal";
import { networkConfig } from "./networkConfig";
import { publicClient } from "./clients";
import { stash } from "./stash";

export async function sync(): Promise<SyncToStashResult> {
  return syncToStash({
    stash,
    address: networkConfig.worldAddress,
    publicClient,
    startBlock: networkConfig.initialBlockNumber,
  });
}
