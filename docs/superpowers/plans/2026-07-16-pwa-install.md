# PWA Install Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The app can be installed to a phone's (or desktop's) home screen, opens standalone with no browser chrome, and its shell (routing + static UI) loads even with no network — while all Firebase/API data calls stay network-only.

**Architecture:** `vite-plugin-pwa` generates the web app manifest and a Workbox-based service worker from Vite config. `@vite-pwa/assets-generator` generates the full icon set from the existing (non-square) logo asset. A small `useRegisterSW` hook wires "new version available" into the existing `sonner` toast setup, since `autoUpdate` swaps service workers silently otherwise.

**Tech Stack:** `vite-plugin-pwa`, `@vite-pwa/assets-generator` (both new devDependencies), Workbox (transitive, bundled by vite-plugin-pwa).

**Spec:** `docs/superpowers/specs/2026-07-16-mobile-optimization-design.md` (see "PWA install support" section)

## Global Constraints

- `display: "standalone"`, `start_url: "/"`, `name: "Career Genie"`, `short_name: "CareerGenie"`.
- `theme_color: "#BE460E"` (from `--primary: 19 86% 40%` in `src/index.css:25`), `background_color: "#F6F3EF"` (from `--background: 36 29% 95%` in `src/index.css:14`) — computed via standard HSL→RGB conversion, not invented values.
- Icons generated from `src/assets/genie-logo.png` (421×593, not square — must go through the assets generator, not be resized naively).
- Service worker precaches the built app shell and provides a navigation fallback so routing works offline; it must NOT cache Firebase/API responses — those stay network-only.
- No offline write/sync capability, no push notifications — out of scope per the spec.
- `bun run typecheck` and `bun run test` must pass after every task.

---

### Task 1: Install dependencies and generate the icon set

**Files:**
- Modify: `package.json`, `bun.lock`
- Create: `pwa-assets.config.ts`
- Create (generated): `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/maskable-icon-512x512.png`, `public/apple-touch-icon-180x180.png`, `public/favicon.svg` (exact filenames depend on the generator's default preset — confirm the actual output list in the step below and use those names verbatim in Task 2)

**Interfaces:**
- Produces: a set of icon files under `public/` whose exact filenames Task 2's manifest config must reference.

- [ ] **Step 1: Install the plugin and asset generator**

Run: `bun add -D vite-plugin-pwa @vite-pwa/assets-generator`
Expected: both added to `devDependencies` in `package.json`, `bun.lock` updated.

- [ ] **Step 2: Create the assets generator config**

Create `pwa-assets.config.ts`:

```ts
import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: minimal2023Preset,
  images: ["src/assets/genie-logo.png"],
});
```

- [ ] **Step 3: Run the generator**

Run: `bunx pwa-assets-generator`
Expected: icon files written into `public/` (or wherever `minimal2023Preset` places them — check the command's own output log for the exact list of generated filenames and paths).

- [ ] **Step 4: Record the actual generated filenames**

Run: `ls public/` (or `git status`) and note every new file. Task 2 must reference these exact names in the manifest icon list — do not guess.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock pwa-assets.config.ts public/
git commit -m "feat: generate PWA icon set from genie-logo.png"
```

---

### Task 2: Configure vite-plugin-pwa (manifest + service worker)

**Files:**
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: the exact icon filenames generated in Task 1.
- Produces: `virtual:pwa-register/react`'s `useRegisterSW` hook, which Task 3 imports.

- [ ] **Step 1: Add the plugin to `vite.config.ts`**

Add the import at the top of `vite.config.ts`:

```ts
import { VitePWA } from "vite-plugin-pwa";
```

Add `VitePWA(...)` to the `plugins` array (alongside the existing `react()` and `componentTagger()` entries — keep those, just add this one), replacing `<icon files from Task 1>` with the real filenames recorded in Task 1 Step 4:

```ts
VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "robots.txt"],
  manifest: {
    name: "Career Genie",
    short_name: "CareerGenie",
    description: "AI-powered career guidance: resume building, interview prep, mentorship, and career exploration.",
    theme_color: "#BE460E",
    background_color: "#F6F3EF",
    display: "standalone",
    start_url: "/",
    icons: [
      { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  },
  workbox: {
    navigateFallback: "/index.html",
    navigateFallbackDenylist: [/^\/api\//],
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
    runtimeCaching: [
      {
        urlPattern: ({ url }) =>
          url.hostname.includes("firebaseio.com") ||
          url.hostname.includes("firestore.googleapis.com") ||
          url.hostname.includes("identitytoolkit.googleapis.com") ||
          url.pathname.startsWith("/api/"),
        handler: "NetworkOnly",
      },
    ],
  },
}),
```

- [ ] **Step 2: Verify the icon filenames match**

Cross-check every `src` value in the `icons` array against the filenames recorded in Task 1 Step 4. Fix any mismatch now — a wrong path here silently breaks installability.

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: no errors (the plugin ships its own types).

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts
git commit -m "feat: configure vite-plugin-pwa manifest and service worker"
```

---

### Task 3: Wire "update available" toast

**Files:**
- Create: `src/hooks/usePwaUpdatePrompt.ts`
- Modify: `src/App.tsx`, `src/vite-env.d.ts`

**Interfaces:**
- Consumes: `useRegisterSW` from `virtual:pwa-register/react` (provided by the plugin configured in Task 2).
- Produces: `usePwaUpdatePrompt(): void` — call once near the app root; has no return value, purely triggers a `sonner` toast as a side effect when an update is ready.

`autoUpdate` installs new service worker versions silently in the background; without this, a user can be stuck running stale JS after a deploy with no way to know a refresh would fix it.

- [ ] **Step 1: Register the virtual module's types**

The `virtual:pwa-register/react` import used below doesn't resolve for TypeScript without this reference. Add it to `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
```

- [ ] **Step 2: Create the hook**

Create `src/hooks/usePwaUpdatePrompt.ts`:

```ts
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
```

- [ ] **Step 3: Call the hook from `App.tsx`**

In `src/App.tsx`, add the import near the top:

```tsx
import { usePwaUpdatePrompt } from "@/hooks/usePwaUpdatePrompt";
```

Inside the `App` component (`src/App.tsx:53`), call it before the returned JSX:

```tsx
const App = () => {
  usePwaUpdatePrompt();
  return (
    <QueryClientProvider client={queryClient}>
      {/* ...existing tree unchanged... */}
    </QueryClientProvider>
  );
};
```

(This changes `App` from an implicit-return arrow function to a block body — keep everything currently inside the parentheses exactly as-is, just wrapped in `return (...)`.)

- [ ] **Step 4: Run typecheck**

Run: `bun run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/usePwaUpdatePrompt.ts src/App.tsx src/vite-env.d.ts
git commit -m "feat: prompt users to refresh when a new service worker is ready"
```

---

### Task 4: Build verification (manifest, install prompt, offline shell)

**Files:** None (verification only).

**Interfaces:** None.

- [ ] **Step 1: Production build**

Run: `bun run build`
Expected: build succeeds; output includes `dist/manifest.webmanifest` (or `site.webmanifest`, per the plugin's default) and `dist/sw.js`.

- [ ] **Step 2: Serve the production build locally**

Run: `bun run preview`
Expected: prints a local URL (default `http://localhost:4173`).

- [ ] **Step 3: Verify the manifest and service worker in the browser**

Using the Chrome DevTools MCP tools: navigate to the preview URL, then use `evaluate_script` to confirm `navigator.serviceWorker.controller` is non-null after a reload (service worker is active and controlling the page), and confirm `document.querySelector('link[rel="manifest"]')` exists and its `href` resolves.

- [ ] **Step 4: Verify offline app shell**

With the page loaded once (so the service worker has installed and precached), simulate offline (network throttling to "offline" via the DevTools tools), then navigate to a different in-app route (e.g. `/about`). Expected: the route renders from cache instead of showing the browser's offline error page. Take a screenshot as evidence.

- [ ] **Step 5: Verify data calls are NOT cached**

Confirm (via `list_network_requests` or equivalent) that Firebase/Firestore requests are not served from the service worker cache while online — they should hit the network every time, per the `NetworkOnly` runtime caching rule from Task 2.

- [ ] **Step 6: Run the full test suite**

Run: `bun run test`
Expected: all existing tests still pass — this task only adds build tooling and a toast hook, no existing behavior should change.

- [ ] **Step 7: Commit (if anything changed, e.g. a lockfile or generated output worth tracking)**

```bash
git status
```

If nothing is staged, no commit is needed — this task is verification-only. Otherwise commit with a message describing what changed.
