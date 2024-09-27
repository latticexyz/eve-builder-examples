// Note: stash is the new experimental client side state library for MUD.
// Some APIs might change until it has reached a stable state.
import { createStash, CreateStashResult } from "@latticexyz/stash/internal";
import mudConfig from "contracts/mud.config";

export const stash: CreateStashResult<typeof mudConfig> =
  createStash(mudConfig);
