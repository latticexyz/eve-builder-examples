import { useRecord } from "../mud/useRecord";
import mudConfig from "@eveworld/world/mud.config";
import { SmartCharacter } from "@eveworld/types";
import { worldStash } from "../mud/stash";
import { useAccount } from "wagmi";

export function useSmartCharacter() {
	const { address } = useAccount();

	const smartCharacterByAddress = useRecord({
		stash: worldStash,
		table: mudConfig.namespaces.eveworld.tables.CharactersByAddressTable,
		key: {
			characterAddress: address as `0x${string}`,
		},
	});

	const smartCharacterRecord = useRecord({
		stash: worldStash,
		table: mudConfig.namespaces.eveworld.tables.EntityRecordOffchainTable,
		key: {
			entityId: smartCharacterByAddress?.characterId || BigInt(0),
		},
	});

	const smartCharacter: SmartCharacter = {
		address: smartCharacterByAddress?.characterAddress || address || "0x",
		id: smartCharacterByAddress?.characterId.toString() || "",
		name: smartCharacterRecord?.name || "",
		isSmartCharacter: smartCharacterRecord != undefined,
		eveBalanceWei: 0, // TODO: Query from address
		gasBalanceWei: 0, // TODO: Query from ERC-20 contract
		image: "",
		smartAssemblies: [],
	};

	console.log("smartCharacter", smartCharacter);

	return { smartCharacter };
}
