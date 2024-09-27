import {
  Stash,
  State,
  StoreConfig,
  subscribeStore,
} from "@latticexyz/stash/internal";
import { useEffect, useRef, useState } from "react";

// TODO: move to @latticexyz/stash
export function useStash<config extends StoreConfig, T>(
  stash: Stash<config>,
  selector: (stash: State<config>) => T,
  equals: (a: T, b: T) => boolean = (a, b) => a === b
): T {
  const state = useRef(selector(stash.get()));
  console.log("initial state", stash.get().records.test.GuestList);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    function syncState() {
      const nextState = selector(stash.get());
      if (!equals(state.current, nextState)) {
        state.current = nextState;
        forceUpdate({});
      }
    }
    return subscribeStore({ stash, subscriber: syncState });
  }, [equals, selector, stash]);

  return state.current;
}
