import { useSyncProgress } from "./mud/useSyncProgress";
import { useAccount } from "wagmi";

import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";

import { ConnectWallet, EveAlert, EveLayout } from "@eveworld/ui-components";
import { useNotification } from "@eveworld/contexts";
import EntityView from "./components/EntityView";
import { Explorer } from "./Explorer";
import { useSmartCharacter } from "./hooks/useSmartCharacter";

export const App = () => {
  const { isLive, message, percentage } = useSyncProgress();
  const { smartCharacter } = useSmartCharacter();
  const { chain, address } = useAccount();
  const { notification } = useNotification();

  if (!address) return <ConnectWallet />;

  return (
    <>
      <EveAlert
        message={notification.message}
        severity={notification.severity}
        handleClose={notification.handleClose}
        isOpen={notification.isOpen}
        isStyled={false}
        blockExplorer={chain?.blockExplorers?.default?.url}
        txHash={notification.txHash}
      />

      <EveLayout smartCharacter={smartCharacter}>
        {isLive ? (
          <div className="flex flex-col align-center max-w-[1250px] mx-auto px-4">
            <EntityView />
          </div>
        ) : (
          <div className="tabular-nums">
            {message} ({percentage.toFixed(1)}%)…
          </div>
        )}
      </EveLayout>

      <Explorer />
    </>
  );
};
