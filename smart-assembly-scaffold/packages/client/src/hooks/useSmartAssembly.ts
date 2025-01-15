import { useRecord } from "../mud/useRecord";
import mudConfig from "@eveworld/world/mud.config";
import {
  SmartAssemblies,
  SmartAssembly,
  SmartAssemblyType,
  State,
} from "@eveworld/types";
import { worldStash } from "../mud/stash";

export function useSmartAssembly() {
  const smartObjectId = BigInt(import.meta.env.VITE_SMARTASSEMBLY_ID);

  // BASIC SMART ASSEMBLY VALUES //
  const smartDeployableStateView = useRecord({
    stash: worldStash,
    table: mudConfig.namespaces.eveworld.tables.DeployableState,
    key: {
      smartObjectId,
    },
  });

  const smartAssemblyType = useRecord({
    stash: worldStash,
    table: mudConfig.namespaces.eveworld.tables.SmartAssemblyTable,
    key: {
      smartObjectId,
    },
  });

  const smartAssemblyLocation = useRecord({
    stash: worldStash,
    table: mudConfig.namespaces.eveworld.tables.LocationTable,
    key: {
      smartObjectId,
    },
  });

  const smartAssemblyEntityOffchainRecord = useRecord({
    stash: worldStash,
    table: mudConfig.namespaces.eveworld.tables.EntityRecordOffchainTable,
    key: {
      entityId: smartObjectId,
    },
  });

  const smartAssemblyEntityRecord = useRecord({
    stash: worldStash,
    table: mudConfig.namespaces.eveworld.tables.EntityRecordTable,
    key: {
      entityId: smartObjectId,
    },
  });

  const smartAssemblyFuelBalance = useRecord({
    stash: worldStash,
    table: mudConfig.namespaces.eveworld.tables.DeployableFuelBalance,
    key: {
      smartObjectId,
    },
  });

  // const characterId = useRecord({
  // 	stash: worldStash,
  // 	table: mudConfig.namespaces.eveworld.tables.CharactersByAddressTable,
  // 	key: {
  // 		smartObjectId: smartDeployableStateView.,
  // 	},
  // });

  // const ownerCharacter = useRecord({
  // 	stash: worldStash,
  // 	table: mudConfig.namespaces.eveworld.tables.CharactersByAddressTable,
  // 	key: {
  // 		smartObjectId: smartDeployableStateView.,
  // 	},
  // });

  console.log(smartAssemblyEntityRecord);

  const smartAssemblyBase: SmartAssembly = {
    id: smartDeployableStateView?.smartObjectId.toString() || "",
    itemId: Number(smartAssemblyEntityRecord?.itemId) || 0,
    ownerId: `0xb438575e52499614568785ba6af16d5365ffa066`,
    ownerName: "",
    chainId: 0,
    name: smartAssemblyEntityOffchainRecord?.name || "",
    description: smartAssemblyEntityOffchainRecord?.description || "",
    dappUrl: smartAssemblyEntityOffchainRecord?.dappURL || "",
    image: "",
    isValid: smartDeployableStateView?.isValid || false,
    isOnline: smartDeployableStateView?.currentState == State.ONLINE,
    stateId: smartDeployableStateView?.currentState || State.NULL,
    state: smartDeployableStateView?.currentState || State.NULL,
    anchoredAtTime: smartDeployableStateView?.anchoredAt.toString() || "",
    solarSystemId: Number(smartAssemblyLocation?.solarSystemId),
    solarSystem: {
      solarSystemId: smartAssemblyLocation?.solarSystemId.toString() || "",
      solarSystemName: smartAssemblyLocation?.solarSystemId.toString() || "",
      solarSystemNameId: smartAssemblyLocation?.solarSystemId.toString() || "",
    },
    typeId: Number(smartAssemblyEntityRecord?.typeId) || 0,
    region: "",
    locationX: smartAssemblyLocation?.x.toString() || "",
    locationY: smartAssemblyLocation?.y.toString() || "",
    locationZ: smartAssemblyLocation?.z.toString() || "",
    floorPrice: "",
    fuel: {
      fuelAmount: smartAssemblyFuelBalance?.fuelAmount || BigInt(0),
      fuelConsumptionPerMin:
        smartAssemblyFuelBalance?.fuelConsumptionPerMinute || BigInt(0),
      fuelMaxCapacity: smartAssemblyFuelBalance?.fuelMaxCapacity || BigInt(0),
      fuelUnitVolume: smartAssemblyFuelBalance?.fuelUnitVolume || BigInt(10),
    },
  };

  let smartAssembly: SmartAssemblyType<SmartAssemblies> | undefined;

  // SMART GATE VALUES //
  const smartgateLink = useRecord({
    stash: worldStash,
    table: mudConfig.namespaces.eveworld.tables.SmartGateLinkTable,
    key: {
      sourceGateId: smartObjectId,
    },
  });

  // SMART STORAGE UNIT VALUES //

  switch (smartAssemblyType?.smartAssemblyType) {
    case 0:
      smartAssembly = {
        ...smartAssemblyBase,
        assemblyType: "SmartStorageUnit",
        gateLink: {
          gatesInRange: [],
          isLinked: false,
          destinationGate: undefined,
        },
      };
      break;
    case 1:
      smartAssembly = {
        ...smartAssemblyBase,
        assemblyType: "SmartGate",
        gateLink: {
          gatesInRange: [],
          isLinked: smartgateLink?.isLinked || false,
          destinationGate:
            smartgateLink?.destinationGateId.toString() || undefined,
        },
      };
      break;
    // case 2:
    // 	smartAssembly = {
    // 		...smartAssemblyBase,
    // 		assemblyType: "SmartTurret",
    // 	};
    // 	break;
  }

  return { smartAssembly };
}
