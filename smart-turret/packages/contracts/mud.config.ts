import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "test",
  tables: {
    GuestList: {
      schema: {
        characterId: "uint256",
        hasAccess: "bool",
      },
      key: ["characterId"],
    },
  },
});
