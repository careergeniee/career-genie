import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

// vite.config.ts sets registerType: "autoUpdate", so the service worker
// activates the new version automatically (no "waiting" state). In that
// mode vite-plugin-pwa's registerSW() calls onNeedReload() -- not
// onNeedRefresh()/needRefresh -- right when the new SW has taken control
// and the page would otherwise be silently reloaded via
// `window.location.reload()`. We hook onNeedReload to show a toast instead
// of letting that default reload happen, and reload ourselves once the
// user confirms. (See node_modules/vite-plugin-pwa/dist/client/build/register.js,
// the `if (auto) { wb.addEventListener("activated", ...) }` branch.)
export const usePwaUpdatePrompt = () => {
  useRegisterSW({
    onNeedReload() {
      toast("A new version of Career Genie is available.", {
        duration: Infinity,
        action: {
          label: "Refresh",
          onClick: () => window.location.reload(),
        },
      });
    },
  });
};
