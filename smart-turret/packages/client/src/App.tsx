import { useCallback, useState } from "react";
import { stash } from "./mud/stash";
import { useStash } from "./mud/useStash";
import { worldContract } from "./mud/worldContract";

export const App = () => {
  const [characterId, setCharacterId] = useState(0n);

  const guestList = useStash(stash, (state) =>
    Object.values(state.records.test.GuestList)
  );

  const addToGuestList = useCallback(() => {
    worldContract.write.test__addToGuestList([characterId]);
  }, [characterId]);

  return (
    <div>
      <div>
        <input
          id="characterId"
          placeholder="Character ID"
          value={String(characterId)}
          onChange={(e) => setCharacterId(BigInt(e.target.value))}
        ></input>
        <button onClick={addToGuestList}>Add to guest list</button>
      </div>
      <div>
        Guest list:
        <ul>
          {guestList.map((item) => (
            <li key={"guestList-" + item.characterId}>
              {String(item.characterId)}: {String(item.hasAccess)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
