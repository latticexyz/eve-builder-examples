// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { SmartTurretLib } from "@eveworld/world/src/modules/smart-turret/SmartTurretLib.sol";
import { IBaseWorld } from "@latticexyz/world/src/codegen/interfaces/IBaseWorld.sol";
import { FRONTIER_WORLD_DEPLOYMENT_NAMESPACE } from "@eveworld/common-constants/src/constants.sol";
import { DeployableState, DeployableStateData } from "@eveworld/world/src/codegen/tables/DeployableState.sol";
import { ResourceIds } from "@latticexyz/store/src/codegen/tables/ResourceIds.sol";
import { SmartTurretConfigTable } from "@eveworld/world/src/codegen/tables/SmartTurretConfigTable.sol";
import { CharactersTableData, CharactersTable } from "@eveworld/world/src/codegen/tables/CharactersTable.sol";
import { ResourceId, WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { TargetPriority, Turret, SmartTurretTarget } from "@eveworld/world/src/modules/smart-turret/types.sol";
import { Utils as SmartCharacterUtils } from "@eveworld/world/src/modules/smart-character/Utils.sol";
import { Utils as SmartDeployableUtils } from "@eveworld/world/src/modules/smart-deployable/Utils.sol";
import { Utils as SmartTurretUtils } from "@eveworld/world/src/modules/smart-turret/Utils.sol";
import { State } from "@eveworld/world/src/codegen/common.sol";

import { Utils } from "../src/systems/Utils.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GuestList } from "../src/codegen/tables/GuestList.sol";

contract SmartTurretTest is MudTest {
  using SmartTurretUtils for bytes14;
  using SmartTurretLib for SmartTurretLib.World;
  using SmartDeployableUtils for bytes14;
  using SmartCharacterUtils for bytes14;

  IWorld world;
  uint256 characterId;
  uint256 otherCharacterId;
  uint256 corpId;
  uint256 smartTurretId;
  SmartTurretLib.World smartTurret;

  TargetPriority[] previousPriorityQueue;
  Turret turret;
  SmartTurretTarget previousTurretTarget;
  SmartTurretTarget newTurretTarget;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    characterId = vm.envUint("CHARACTER_ID");
    otherCharacterId = uint256(keccak256("otherCharacter"));
    corpId = vm.envUint("CORP_ID");
    smartTurretId = vm.envUint("SMART_TURRET_ID");
    smartTurret = SmartTurretLib.World({
      iface: IBaseWorld(worldAddress),
      namespace: FRONTIER_WORLD_DEPLOYMENT_NAMESPACE
    });

    turret = Turret({ weaponTypeId: 1, ammoTypeId: 1, chargesLeft: 100 });
    previousTurretTarget = SmartTurretTarget({
      shipId: 1,
      shipTypeId: 1,
      characterId: otherCharacterId,
      hpRatio: 100,
      shieldRatio: 100,
      armorRatio: 100
    });
    newTurretTarget = SmartTurretTarget({
      shipId: 1,
      shipTypeId: 1,
      characterId: characterId,
      hpRatio: 100,
      shieldRatio: 100,
      armorRatio: 100
    });

    previousPriorityQueue.push(TargetPriority({ target: previousTurretTarget, weight: 100 }));
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testSmartTurretConfigured() public {
    // Expect the smart turret to be configured
    assertTrue(ResourceIds.getExists(SmartTurretConfigTable.get(smartTurretId)), "turret should be configured");

    // Expect the smart turret to be online
    assertEq(uint8(DeployableState.getCurrentState(smartTurretId)), uint8(State.ONLINE), "turret should be online");

    // Expect the character's corp ID to be the configured corp ID
    assertEq(CharactersTable.getCorpId(characterId), corpId, "corp ID should match");

    // Expect a random other character's corp ID to not be configured
    assertEq(CharactersTable.getCorpId(otherCharacterId), 0, "corp ID should not be configured");
  }

  function testInProximity() public {
    world.test__addToGuestList(characterId);

    TargetPriority[] memory returnTargetQueue = smartTurret.inProximity(
      smartTurretId,
      characterId,
      previousPriorityQueue,
      turret,
      newTurretTarget
    );

    assertEq(returnTargetQueue.length, 1);
    assertEq(returnTargetQueue[0].target.characterId, previousTurretTarget.characterId);
  }
}
