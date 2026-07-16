# Mobile Optimization Pass — Design

## Goal
CareerGenie was built desktop-first. Navigation already collapses correctly on
small screens (marketing [Navbar](../../../src/components/Navbar.tsx) has a
hamburger menu; [DashboardLayout](../../../src/components/DashboardLayout.tsx)
has a slide-in sidebar), and most pages already use some responsive grid
classes (`md:grid-cols-*`, `lg:grid-cols-*`). What's missing is a systematic
check of page *content* at small widths — the goal is that every page renders
cleanly, with no horizontal overflow, no clipped/overlapping elements, and no
sub-44px tap targets, down to a 375px-wide viewport (iPhone SE/mini), with a
768px tablet spot-check along the way.

## Scope
All pages, in this order:

1. **Shared shell** (spot-check only — already largely responsive): Navbar,
   Footer, Layout, DashboardLayout
2. **Marketing pages**: Index, About, Contact, Login, Signup, ForgotPassword
3. **Dashboard pages**: Home, Assessment, Careers, Instructor (+ its tabs),
   Chat, Resume + ResumeForm, Interview + InterviewSession, Roadmap, Settings

## Method
For each page: load it in a real browser via the Chrome DevTools MCP tools,
resize to 375px width, screenshot, visually inspect for overflow / clipping /
overlap / illegible type / cramped touch targets, fix with Tailwind responsive
classes, then re-screenshot to confirm. Spot-check 768px afterward for pages
with grid layouts, since a fix that works at 375px can look sparse or broken
at tablet width.

No new dependencies, no breakpoint system changes — this stays entirely
within Tailwind's existing `sm`/`md`/`lg` scale already used throughout the
codebase.

## Expected fix patterns
These aren't prescriptive per-page (real findings will vary), but are the
recurring shapes I expect based on a first pass over the code:

- Multi-column grids (`grid-cols-2`/`grid-cols-3` without a mobile fallback)
  → stack to 1 column below `sm`/`md`
- Large display/hero type (`text-5xl`+) → scaled down via responsive `text-*`
  classes at small widths
- Side-by-side split layouts (Resume Builder's editor + live preview) →
  stack vertically on mobile
- Recharts / chart containers that assume a fixed pixel width → confirm they
  use `ResponsiveContainer` correctly and don't clip labels/legends
- Any wide, non-scrolling content (tables, stat rows) → horizontal scroll
  container or convert to stacked cards on mobile
- Modals/dialogs → confirm they fit within small-viewport height and don't
  require awkward scrolling to reach action buttons
- Buttons/icons sized under ~44px tap target on interactive rows

## Out of scope
- Visual redesign or new features
- Changing the desktop layout/behavior (mobile-only fixes; desktop must be
  unaffected)
- Performance optimization (separate concern from layout/responsiveness)
- Native app / PWA considerations

## Verification
Each page gets a before/after mobile screenshot. No automated visual
regression suite exists for this, so verification is manual via the browser
tools, plus running `typecheck` and the existing test suite (`vitest run`) at
the end to confirm no regressions from the class/markup changes.
