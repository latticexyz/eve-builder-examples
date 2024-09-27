// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { GuestList } from "../codegen/tables/GuestList.sol";

contract GuestListSystem is System {
  function addToGuestList(uint256 characterId) public {
    GuestList.setHasAccess(characterId, true);
  }
}
