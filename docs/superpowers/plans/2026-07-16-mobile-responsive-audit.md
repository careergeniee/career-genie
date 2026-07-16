# Mobile Responsive Audit & Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every page in the app (marketing + dashboard) renders cleanly at 375px width — no horizontal overflow, no clipped/overlapping content, no sub-44px tap targets — without changing desktop behavior.

**Architecture:** This is a visual audit-and-fix pass, not new application logic, so "tests" here means live browser verification (Chrome DevTools MCP tools against the local dev server), not unit tests — this matches the Verification method in the approved spec. Every task follows the same loop: navigate to the route at 375px width, screenshot, check it against the shared Mobile QA Checklist below, fix with Tailwind classes using the shared Fix Recipes below, re-screenshot to confirm, spot-check 768px, typecheck, commit.

**Tech Stack:** React + TypeScript + Tailwind CSS (existing `sm`/`md`/`lg` breakpoint scale only — no new dependencies).

**Spec:** `docs/superpowers/specs/2026-07-16-mobile-optimization-design.md`

## Global Constraints

- Must render cleanly (no horizontal overflow, no clipping) at 375px width; spot-check 768px after each fix.
- Do not change desktop (`lg`+) layout or behavior — only add/adjust classes scoped below `sm`/`md`.
- No new dependencies — Tailwind classes only.
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

### Task 14: Final regression pass

**Files:** None (verification only).

**Interfaces:** None.

- [ ] Confirm `git diff src/App.tsx` is empty (the QA auth bypass from setup was reverted). If not, run `git checkout -- src/App.tsx` now.
- [ ] Run: `bun run typecheck` — expect no errors.
- [ ] Run: `bun run test` — expect all existing tests to still pass (this is a CSS/markup-only pass; no test behavior should have changed).
- [ ] Re-screenshot all 16 routes at 375px one more time in sequence as a final sanity pass (reuse the QA bypass locally if needed for the dashboard routes, and revert it again afterward).
- [ ] Spot-check two or three pages at 1280px (desktop) to confirm nothing regressed there.
- [ ] Commit any final stragglers with a message summarizing the pass, e.g. `git commit -m "fix: final mobile regression pass across marketing + dashboard pages"` (skip if there's nothing left to commit).
