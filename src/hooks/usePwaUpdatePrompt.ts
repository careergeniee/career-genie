import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

export const usePwaUpdatePrompt = () => {
  const { needRefresh, updateServiceWorker } = useRegisterSW();

  useEffect(() => {
    if (!needRefresh[0]) return;
    toast("A new version of Career Genie is available.", {
      duration: Infinity,
      action: {
        label: "Refresh",
        onClick: () => updateServiceWorker(true),
      },
    });
  }, [needRefresh, updateServiceWorker]);
};
