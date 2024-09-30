//SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
import { ResourceIds } from "@latticexyz/store/src/codegen/tables/ResourceIds.sol";
import { TargetPriority, Turret, SmartTurretTarget } from "@eveworld/world/src/modules/smart-turret/types.sol";

import { SMART_TURRET_DEPLOYMENT_NAMESPACE, SMART_TURRET_SYSTEM_NAME } from "./constants.sol";

library Utils {
  function smartTurretSystemId() internal pure returns (ResourceId) {
    return
      WorldResourceIdLib.encode({
        typeId: RESOURCE_SYSTEM,
        namespace: SMART_TURRET_DEPLOYMENT_NAMESPACE,
        name: SMART_TURRET_SYSTEM_NAME
      });
  }

  function filterPriorityQueue(
    TargetPriority[] memory priorityQueue,
    function(SmartTurretTarget memory) returns (bool) filter
  ) internal returns (TargetPriority[] memory) {
    // Initialize the array with the maximum possible size
    TargetPriority[] memory filteredPriorityQueue = new TargetPriority[](priorityQueue.length);

    // Filter the input array and count the filtered elements
    uint256 count;
    for (uint256 i; i < priorityQueue.length; i++) {
      if (filter(priorityQueue[i].target)) {
        filteredPriorityQueue[count++] = priorityQueue[i];
      }
    }

    // Resize the output array to the right size
    assembly {
      mstore(filteredPriorityQueue, count)
    }

    return filteredPriorityQueue;
  }

  function pushPriorityQueue(
    TargetPriority[] memory priorityQueue,
    TargetPriority memory newTarget
  ) internal pure returns (TargetPriority[] memory) {
    TargetPriority[] memory newPriorityQueue = new TargetPriority[](priorityQueue.length + 1);
    for (uint256 i; i < priorityQueue.length; i++) {
      newPriorityQueue[i] = priorityQueue[i];
    }
    newPriorityQueue[priorityQueue.length] = newTarget;
    return newPriorityQueue;
  }
}
