import { createStash } from "@latticexyz/stash/internal";
import config from "contracts/mud.config";
import worldConfig from "@eveworld/world/mud.config";

export const stash = createStash(config);
export const worldStash = createStash(worldConfig);
