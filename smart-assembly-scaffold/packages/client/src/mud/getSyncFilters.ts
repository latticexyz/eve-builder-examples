import { Table } from "@latticexyz/config";
import { SyncFilter } from "@latticexyz/store-sync";

type Config = {
  [namespace: string]: {
    [table: string]: Table;
  };
};

export function getSyncFilters(storeConfig: Config): SyncFilter[] {
  return Object.keys(storeConfig).flatMap((namespace) => {
    return Object.keys(storeConfig[namespace]).map((table) => {
      return {
        tableId: storeConfig[namespace][table].tableId,
      };
    });
  });
}
