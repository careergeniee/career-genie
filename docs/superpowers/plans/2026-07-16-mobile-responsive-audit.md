# Mobile Responsive Audit & Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every page in the app (marketing + dashboard) renders cleanly at 375px width — no horizontal overflow, no clipped/overlapping content, no sub-44px tap targets — without changing desktop behavior.

**Architecture:** This is a visual audit-and-fix pass, not new application logic, so "tests" here means live browser verification (Chrome DevTools MCP tools against the local dev server), not unit tests — this matches the Verification method in the approved spec. Every task follows the same loop: navigate to the route at 375px width, screenshot, check it against the shared Mobile QA Checklist below, fix with Tailwind classes using the shared Fix Recipes below, re-screenshot to confirm, spot-check 768px, typecheck, commit.

**Tech Stack:** React + TypeScript + Tailwind CSS (existing `sm`/`md`/`lg` breakpoint scale only — no new dependencies).

**Spec:** `docs/superpowers/specs/2026-07-16-mobile-optimization-design.md`

## Global Constraints

- Must render cleanly (no horizontal overflow, no clipping) at 375px width; spot-check 768px after each fix.
- Do not change desktop (`lg`+) layout or behavior — only add/adjust classes scoped below `sm`/`md`.
- No new dependencies — Tailwind classes only, with one named, user-approved exception: Task 14 (added after Task 2 uncovered a bug no CSS-only fix could fully resolve) makes a small JS behavior change to `HeroShowcase.tsx`.
- Interactive elements (buttons, links, icons) need ≥44×44px tap targets with reasonable spacing between adjacent ones.
- `bun run typecheck` must pass after every task; `bun run test` must still pass at the end.

---

## One-time setup (before Task 1)

- [ ] **Start the dev server**

Run: `bun run dev`
Expected: Vite prints `Local: http://localhost:8080/`

- [ ] **Enable dashboard access for QA (local-only, never committed)**

`/dashboard/*` routes are gated behind Firebase auth via `PrivateRoute` in `src/App.tsx:47-51`. To screenshot dashboard pages without a real login, temporarily bypass the gate on your local checkout only:

```tsx
// src/App.tsx — TEMPORARY, for local QA only
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
```

Before Task 5 (the first dashboard task) apply this edit locally. **Do not commit it.** Once all dashboard tasks (5–13) are done, run `git checkout -- src/App.tsx` to restore the real guard, then confirm with `git diff src/App.tsx` that it's clean before the final commit in Task 14.

## Shared reference material

### Mobile QA Checklist (run against every page at 375px)

1. **No horizontal overflow** — confirm via the browser tools' `evaluate_script`: `document.documentElement.scrollWidth` must equal `window.innerWidth` (375). If greater, something is overflowing.
2. Headings/body text wrap normally — nothing visually clipped or spilling out of its container.
3. Any grid/flex row with 2+ columns on desktop collapses to a sensible column count at 375px (usually 1).
4. Buttons, icon-buttons, and links are ≥44×44px with visible spacing from neighboring targets.
5. Modals/drawers/dialogs fit within the viewport height at 375×667 (iPhone SE); primary actions are reachable without awkward scrolling.
6. Any `recharts` chart resizes to its container and doesn't clip axis labels or legends.
7. Form inputs are full-width (not fixed pixel widths that force overflow); labels aren't squished against inputs.
8. Any side-by-side (desktop) split panel stacks vertically at 375px.

### Tailwind Fix Recipes (apply the one that matches what you find — don't apply blind)

- **Multi-column grid** missing a mobile variant (e.g. `grid-cols-3`) → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (keep the original `lg` count unchanged).
- **Oversized hero/display type** (`text-5xl`+ with no responsive variant) → add a smaller mobile size, e.g. `text-3xl sm:text-4xl lg:text-6xl`, keeping the existing large size at `lg`.
- **Side-by-side split panel** (`flex-row`/`lg:flex-row` with no stack) → `flex-col lg:flex-row`.
- **Chart not filling its container** → wrap/confirm it's inside `<ResponsiveContainer width="100%" height={...}>` from `recharts`.
- **Wide table or stat row that overflows** → wrap in `<div className="overflow-x-auto">…</div>`, or (preferred if it's a card-like row) stack fields vertically below `sm`.
- **Undersized tap target** → add `min-w-11 min-h-11` (44px in the default Tailwind scale) or increase padding (`p-2.5`+) until the rendered box is ≥44px.
- **Fixed pixel width** (`w-[400px]` etc.) causing overflow → replace with `w-full` and a `max-w-*` cap, or add a smaller `w-*` at the base breakpoint with `sm:w-[400px]`.

### Per-task step template (repeat for each task below, substituting the route/files)

- [ ] Navigate to the page's route at `http://localhost:8080<route>` and resize the page to 375×667.
- [ ] Screenshot the full page.
- [ ] Check it against the Mobile QA Checklist above; note every failing item.
- [ ] For each failing item, apply the matching Fix Recipe in the page's component file(s).
- [ ] Re-screenshot and confirm every checklist item now passes (re-run the `scrollWidth` check).
- [ ] Resize to 768×1024 and screenshot; confirm the fix didn't leave the layout sparse/broken at tablet width. Adjust the `sm:`/`md:` breakpoint used if it did.
- [ ] Run: `bun run typecheck` — expect no errors.
- [ ] Commit with a message naming the page(s) touched.

---

### Task 1: Shared shell spot-check — Navbar, Footer, Layout, DashboardLayout

**Files:**
- Modify (if needed): `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/Layout.tsx`, `src/components/DashboardLayout.tsx`

**Interfaces:** None — this task only touches shared layout chrome, no new exports consumed elsewhere.

These already have mobile nav (hamburger menus / slide-in sidebar per the spec's findings), so expect this task to be mostly confirmation, not rewrites.

- [ ] Apply the per-task step template to `/` (exercises Navbar + Footer + Layout) and to `/dashboard` (exercises DashboardLayout) — remember dashboard requires the local QA bypass from the one-time setup above.
- [ ] Specifically confirm: the Navbar hamburger opens/closes cleanly with no overlap, the "Login" button doesn't disappear (it's `hidden sm:inline-flex` at `src/components/Navbar.tsx:56` — confirm the hamburger menu's own Login button at line 75 covers the gap), and the DashboardLayout top bar (`src/components/DashboardLayout.tsx:210-225`) doesn't overflow with the menu button + logo + wordmark at 375px.
- [ ] Commit: `git add src/components/Navbar.tsx src/components/Footer.tsx src/components/Layout.tsx src/components/DashboardLayout.tsx && git commit -m "fix: mobile spot-check shared shell (Navbar/Footer/Layout/DashboardLayout)"` (only add files you actually changed).

---

### Task 2: Index (homepage)

**Files:**
- Modify: `src/pages/Index.tsx`
- Related: `src/components/home/HeroShowcase.tsx`

**Interfaces:** None.

This is the largest, heaviest marketing page (hero, feature sections, likely multiple grids) — expect the most findings here.

- [ ] Apply the per-task step template to route `/`.
- [ ] Pay particular attention to: the hero section's headline size and any 3D/showcase element (`HeroShowcase.tsx`) not overflowing horizontally, and every feature/benefit grid collapsing correctly.
- [ ] Commit: `git add src/pages/Index.tsx src/components/home/HeroShowcase.tsx && git commit -m "fix: mobile layout for Index (homepage)"`

---

### Task 3: About + Contact

**Files:**
- Modify: `src/pages/About.tsx`, `src/pages/Contact.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/about`.
- [ ] Apply the per-task step template to `/contact` — pay attention to the contact form's input widths and the submit button's tap target.
- [ ] Commit: `git add src/pages/About.tsx src/pages/Contact.tsx && git commit -m "fix: mobile layout for About and Contact"`

---

### Task 4: Login + Signup + ForgotPassword

**Files:**
- Modify: `src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/pages/ForgotPassword.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/login`, `/signup`, `/forgot-password`.
- [ ] Pay attention to: form card padding/width at 375px, the Google sign-in button (if present) not clipping its label, and password field show/hide icon tap target size.
- [ ] Commit: `git add src/pages/Login.tsx src/pages/Signup.tsx src/pages/ForgotPassword.tsx && git commit -m "fix: mobile layout for Login, Signup, ForgotPassword"`

---

### Task 5: Dashboard Home

**Files:**
- Modify: `src/pages/dashboard/Home.tsx`
- Related: `src/components/dashboard/StatCard.tsx`, `src/components/dashboard/BarTrend.tsx`, `src/components/dashboard/BubbleStat.tsx`, `src/components/dashboard/ProgressRow.tsx`

**Interfaces:** None.

Apply the local QA auth bypass from the one-time setup before starting this task if not already applied.

- [ ] Apply the per-task step template to `/dashboard`.
- [ ] Pay particular attention to: the stat card grid collapsing to 1 (or 2) columns, `BarTrend`'s chart resizing via `ResponsiveContainer` rather than a fixed pixel width, and `BubbleStat` not overlapping neighboring elements at 375px.
- [ ] Commit: `git add src/pages/dashboard/Home.tsx src/components/dashboard/ && git commit -m "fix: mobile layout for Dashboard Home"`

---

### Task 6: Assessment

**Files:**
- Modify: `src/pages/dashboard/Assessment.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/dashboard/assessment`.
- [ ] Pay attention to: question/option layout (likely a grid of choice cards) collapsing to 1 column, and any rating/slider control's tap target.
- [ ] Commit: `git add src/pages/dashboard/Assessment.tsx && git commit -m "fix: mobile layout for Assessment"`

---

### Task 7: Careers

**Files:**
- Modify: `src/pages/dashboard/Careers.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/dashboard/careers`.
- [ ] Pay attention to: career match cards/grid collapsing correctly and any match-percentage chart resizing.
- [ ] Commit: `git add src/pages/dashboard/Careers.tsx && git commit -m "fix: mobile layout for Careers"`

---

### Task 8: Instructor (+ tabs)

**Files:**
- Modify: `src/pages/dashboard/Instructor.tsx`, `src/pages/dashboard/instructor/DailyTaskTab.tsx`, `src/pages/dashboard/instructor/MentorTab.tsx`, `src/pages/dashboard/instructor/ProgressTab.tsx`, `src/pages/dashboard/instructor/QuizTab.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/dashboard/instructor`, then repeat the screenshot+fix loop for each tab (Daily Task, Mentor, Progress, Quiz) by clicking each tab control before screenshotting — tab switches don't change the URL.
- [ ] Pay attention to: `ProgressTab`'s chart(s) resizing correctly, `QuizTab`'s answer options not becoming cramped, and the tab switcher itself being tappable (≥44px) and not wrapping awkwardly at 375px.
- [ ] Commit: `git add src/pages/dashboard/Instructor.tsx src/pages/dashboard/instructor/ && git commit -m "fix: mobile layout for Instructor and its tabs"`

---

### Task 9: Chat

**Files:**
- Modify: `src/pages/dashboard/Chat.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/dashboard/chat`.
- [ ] Pay attention to: message bubbles not overflowing horizontally, the input box + send button staying usable (not squeezed) at 375px, and long unbroken strings (e.g. URLs) wrapping instead of forcing overflow.
- [ ] Commit: `git add src/pages/dashboard/Chat.tsx && git commit -m "fix: mobile layout for Chat"`

---

### Task 10: Resume Builder

**Files:**
- Modify: `src/pages/dashboard/Resume.tsx`, `src/pages/dashboard/ResumeForm.tsx`
- Related: `src/components/resume/ResumePreview.tsx`, `src/components/resume/preview/*`, `src/components/resume/ResumePDF.tsx` (PDF output — desktop-only concern, don't need mobile changes), `src/components/resume/pdf/*`

**Interfaces:** None.

This page most likely has the split "form editor + live preview" layout called out in the spec as a known risk area.

- [ ] Apply the per-task step template to `/dashboard/resume`.
- [ ] Confirm the editor form and the live preview stack vertically (`flex-col lg:flex-row` or equivalent) at 375px, with the preview not rendered at a fixed desktop pixel width that forces overflow.
- [ ] Commit: `git add src/pages/dashboard/Resume.tsx src/pages/dashboard/ResumeForm.tsx src/components/resume/ && git commit -m "fix: mobile layout for Resume Builder"`

---

### Task 11: Interview Prep (+ session)

**Files:**
- Modify: `src/pages/dashboard/Interview.tsx`, `src/pages/dashboard/InterviewSession.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/dashboard/interview`.
- [ ] Start (or otherwise reach) an interview session so `InterviewSession.tsx` renders, then apply the per-task step template to that screen too — pay attention to any timer/recording UI and the question/answer area not overflowing.
- [ ] Commit: `git add src/pages/dashboard/Interview.tsx src/pages/dashboard/InterviewSession.tsx && git commit -m "fix: mobile layout for Interview Prep"`

---

### Task 12: Roadmap

**Files:**
- Modify: `src/pages/dashboard/Roadmap.tsx`
- Related: `src/components/roadmap/TechStackPanel.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/dashboard/roadmap`.
- [ ] Pay attention to: the roadmap timeline/milestone layout (often a horizontal track on desktop) working as a vertical stack or scroll on mobile, and `TechStackPanel`'s tag/chip list wrapping instead of overflowing.
- [ ] Commit: `git add src/pages/dashboard/Roadmap.tsx src/components/roadmap/TechStackPanel.tsx && git commit -m "fix: mobile layout for Roadmap"`

---

### Task 13: Settings

**Files:**
- Modify: `src/pages/dashboard/Settings.tsx`

**Interfaces:** None.

- [ ] Apply the per-task step template to `/dashboard/settings`.
- [ ] Pay attention to: any settings row with a label + control (toggle/select) on the same line staying aligned without the control being pushed off-screen at 375px.
- [ ] Commit: `git add src/pages/dashboard/Settings.tsx && git commit -m "fix: mobile layout for Settings"`

---

### Task 14: HeroShowcase mobile carousel scroll-centering fix

**Files:**
- Modify: `src/components/home/HeroShowcase.tsx`

**Interfaces:** None — internal component behavior only, no exported signature changes.

**Background:** Task 2 found and partially fixed a real mobile bug in the homepage's "Your Toolkit" card showcase. The 7 preview cards render in a `flex justify-center` row with fixed pixel widths (`CARD_W = 148`, `GAP = 14`, natural row width ≈1120px) inside a ~311px-wide container at 375px viewport. Task 2's fix changed the wrapper in `src/pages/Index.tsx` from `overflow-visible` to `overflow-x-auto`, which made the trailing ~5 of 7 cards reachable by horizontal scroll when the user taps to open the showcase (there's no `hover` on touch devices, so tap is the only way to trigger the open state). However, because the row is `justify-center`, the *leading* 1-2 cards remain clipped and unreachable at the default `scrollLeft: 0` position — centered-flex overflow only exposes trailing-edge overflow to scrolling, not leading-edge, per standard CSS overflow/alignment behavior. Two CSS-only alternatives (`justify-start`, `justify-[safe_center]`) were tried and rejected because both broke the default (closed) centered resting view.

This task is an explicit, user-approved exception to the plan's "Tailwind classes only, no restructuring" scope — a small JS behavior change is required and has been authorized specifically for this component.

- [ ] **Step 1: Read the current component**

Read `src/components/home/HeroShowcase.tsx` in full to find: the ref (or add one) to the scrollable row element, the state variable that tracks open/closed (referred to as `open` in Task 2's report), and the row's DOM structure (the `flex justify-center` container holding the 7 cards).

- [ ] **Step 2: Center the scroll position when the showcase opens**

Add a `useEffect` (or equivalent, matching the file's existing patterns — check whether it already uses `useEffect`/`useRef` elsewhere in this file or the codebase's general style) that, when the open state becomes `true`, sets the row's `scrollLeft` so the natural centered content is scrolled into a position where all 7 cards are reachable in both directions. A simple, robust approach: on open, set `scrollLeft = (row.scrollWidth - row.clientWidth) / 2` — this centers the scroll position within the overflow, making both the leading and trailing edges reachable by scrolling in either direction from the middle, rather than starting pinned at 0 (which only exposes the trailing edge).

Example shape (adapt names/structure to match the actual file):

```tsx
const rowRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!open) return;
  const row = rowRef.current;
  if (!row) return;
  row.scrollLeft = (row.scrollWidth - row.clientWidth) / 2;
}, [open]);
```

Attach `ref={rowRef}` to the same element that carries `overflow-x-auto` (the wrapper in `Index.tsx`) or, if the scrollable element is actually inside `HeroShowcase.tsx` itself, to that internal element — inspect the actual DOM structure from Step 1 to determine which. If the scrollable element lives in `Index.tsx` (the parent), you may need to lift the ref up or accept a `containerRef` prop into `HeroShowcase` — pick whichever is more consistent with the existing prop/ref patterns already used between these two files.

- [ ] **Step 3: Verify in the browser**

Reuse the existing dev server (`curl -sf http://localhost:8080 >/dev/null && echo running` — do not start a second instance; see `.superpowers/sdd/mobile-audit-shared-context.md` for why). Navigate to `/`, resize to 375×667, tap to open the showcase, and use `evaluate_script` to confirm: (a) `scrollLeft` after opening is no longer `0`, (b) scrolling left from that position reveals the previously-clipped leading card(s) fully (no clipped text/edges), (c) scrolling right still reveals the trailing cards fully, (d) closing and reopening the showcase re-centers correctly (no leftover scroll position from a prior interaction). Take screenshots as evidence for the report.

- [ ] **Step 4: Confirm the closed (default) state is unaffected**

Screenshot the closed state at 375px before any tap — must be pixel-equivalent to before this change (single centered stacked card, no visible scrollbar, no layout shift).

- [ ] **Step 5: Spot-check 768px and desktop (1280px)**

Confirm the same open/scroll-centering behavior works reasonably at 768px, and that desktop (`lg`+, where `HeroShowcase` presumably uses `hover` instead of tap per Task 2's report) is entirely unaffected by this change — the `useEffect` should only run on `open`, and desktop's hover-triggered open (if that's how it works there) should still look and behave exactly as before. Read the component to confirm whether desktop uses the same `open` state or a separate hover mechanism before concluding this.

- [ ] **Step 6: Run typecheck**

Run: `bun run typecheck` — expect no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/HeroShowcase.tsx src/pages/Index.tsx
git commit -m "fix: center scroll position on HeroShowcase open so all cards are reachable on mobile"
```

(Include `src/pages/Index.tsx` in the add only if Step 2's ref-wiring required a change there.)

---

### Task 15: Final regression pass

**Files:** None (verification only).

**Interfaces:** None.

- [ ] Confirm `git diff src/App.tsx` is empty (the QA auth bypass from setup was reverted). If not, run `git checkout -- src/App.tsx` now.
- [ ] Run: `bun run typecheck` — expect no errors.
- [ ] Run: `bun run test` — expect all existing tests to still pass (this is a CSS/markup-only pass; no test behavior should have changed).
- [ ] Re-screenshot all 16 routes at 375px one more time in sequence as a final sanity pass (reuse the QA bypass locally if needed for the dashboard routes, and revert it again afterward).
- [ ] Spot-check two or three pages at 1280px (desktop) to confirm nothing regressed there.
- [ ] Commit any final stragglers with a message summarizing the pass, e.g. `git commit -m "fix: final mobile regression pass across marketing + dashboard pages"` (skip if there's nothing left to commit).

---

### Task 16: Shared Input tap-target fix

**Files:**
- Modify: `src/components/ui/input.tsx`

**Interfaces:** None — this is a shared, already-exported component (`Input`) used across nearly every form in the app (Login, Signup, Contact, Assessment, Resume Builder, Settings, etc.). No signature/props change, only its rendered height changes below the `sm` breakpoint.

**Background:** Task 3 found that `Input` renders at `h-10` (40px), just under the plan's 44px tap-target guideline, on both `/about`/`/contact`'s contact form and, implicitly, every other form in the app that uses this component. Rather than flag this repeatedly across every remaining page task, fix it once here, out of numeric order (dispatched immediately after Task 3, before Task 4), so every subsequent task's mobile QA checklist pass already sees the corrected height.

- [ ] Read `src/components/ui/input.tsx` and find the current height class (`h-10`).
- [ ] Change it to be 44px (`h-11`) below `sm`, keeping the existing `h-10` at `sm` and above — e.g. `h-11 sm:h-10` (or equivalent using the file's existing class-composition pattern, such as `cn()`/`cva()` if this file uses one — match whatever pattern is already there rather than introducing a new one). This follows the plan's global constraint of not changing desktop/larger-breakpoint appearance.
- [ ] Reuse the existing dev server (see `.superpowers/sdd/mobile-audit-shared-context.md` — do not start a second instance). Spot-check at least two pages that use `Input` (e.g. `/contact` and `/login`) at 375px to confirm the new height renders correctly with no layout breakage (label alignment, icon alignment if any inputs have leading/trailing icons, spacing within forms), and at `sm`/desktop widths to confirm the height is unchanged from before.
- [ ] Run: `bun run typecheck` — expect no errors.
- [ ] Commit:

```bash
git add src/components/ui/input.tsx
git commit -m "fix: bump shared Input component to 44px tap target on mobile"
```
