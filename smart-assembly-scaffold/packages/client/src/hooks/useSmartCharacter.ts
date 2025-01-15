import { useRecord } from "../mud/useRecord";
import mudConfig from "@eveworld/world/mud.config";
import { SmartCharacter } from "@eveworld/types";
import { stash } from "../mud/stash";
import { useAccount } from "wagmi";

export function useSmartCharacter() {
  const { address } = useAccount();
  const smartCharacterTable = useRecord({
    stash,
    table: mudConfig.namespaces.eveworld.tables.CharactersTable,
    key: {
      characterId: BigInt(
        "4276622189327514248206909304626120238329416063225567926126067537427521625365",
      ),
    },
  });

  console.log("smartCharacterTable", smartCharacterTable);

  const smartCharacter: SmartCharacter = {
    address: smartCharacterTable?.characterAddress || address || "0x",
    id: smartCharacterTable?.characterId.toString() || "",
    name: smartCharacterTable?.characterAddress || "",
    isSmartCharacter: smartCharacterTable != undefined,
    eveBalanceWei: 0,
    gasBalanceWei: 0,
    image: "",
    smartAssemblies: [],
  };

  console.log("smartCharacter", smartCharacter);

  return { smartCharacter };
}
