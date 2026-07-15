# Graph Report - .  (2026-07-16)

## Corpus Check
- 184 files · ~111,989 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1156 nodes · 2048 edges · 132 communities (68 shown, 64 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.79)
- Token cost: 219,409 input · 0 output

## Community Hubs (Navigation)
- Career Matching & Dropdown Menu
- Resume Templates (PDF)
- ESLint & Dev Tooling Deps
- App Shell & Routing
- Animated Text Effects
- ML Service Backend (FastAPI)
- Avatar & Form Controls
- Sidebar & Separator Components
- Documentation: Feature Overview
- Firebase Auth Context
- Career Tech Stack & Roadmap
- TypeScript App Config
- Interview Simulator & Voice Recorder
- Auth Forms & Base UI Inputs
- Instructor Chat & Quiz Tools
- Daily Task Reminder
- package.json Scripts & Metadata
- ML Service README
- Codebase Audit Fix Plan
- Calendar, Pagination & Button UI
- Vite/Node TS Config
- Hero Showcase Previews
- shadcn/ui Components Config
- Dashboard Layout & Bar Trend
- Cloudflare Pages Functions Port Plan
- Animation & Radix UI Deps
- AI Proxy API Routes
- Carousel Component
- Site Entry Point & Robots.txt
- ML Service Test Suite
- Menubar Component
- ML Service Dependencies (requirements/runtime)
- Command Palette UI
- Form Component
- Root TypeScript Config
- Chart Component
- Context Menu Component
- ML Pipeline Diagram
- React Hook Usage Across UI Primitives
- Alert Dialog Component
- Sheet Component
- Table Component
- System Architecture Diagram
- Breadcrumb Component
- Drawer Component
- Navigation Menu Component
- Select Component
- Card Component
- Toggle & Toggle Group
- Algorithm Comparison Chart
- System Context Diagram
- Entity-Relationship Diagram
- Screenshot Automation Script
- Dashboard Stat Card
- Alert Component
- Dashboard Bubble Stat
- Accordion Component
- Badge Component
- class-variance-authority Dependency
- clsx Dependency
- cmdk Dependency
- date-fns Dependency
- EmailJS Dependency
- Embla Carousel Dependency
- Firebase Client SDK Dependency
- Firebase Admin SDK Dependency
- Inter Font Dependency
- Plus Jakarta Sans Font Dependency
- Space Grotesk Font Dependency
- Groq SDK Dependency
- React Hook Form Resolvers Dependency
- Input OTP Dependency
- Lucide Icons Dependency
- next-themes Dependency
- OGL WebGL Dependency
- Radix Accordion Dependency
- Radix Alert Dialog Dependency
- Radix Aspect Ratio Dependency
- Radix Avatar Dependency
- Radix Checkbox Dependency
- Radix Collapsible Dependency
- Radix Context Menu Dependency
- Radix Dialog Dependency
- Radix Dropdown Menu Dependency
- Radix Hover Card Dependency
- Radix Menubar Dependency
- Radix Navigation Menu Dependency
- Radix Popover Dependency
- Radix Progress Dependency
- Radix Radio Group Dependency
- Radix Scroll Area Dependency
- Radix Select Dependency
- Radix Separator Dependency
- Radix Slot Dependency
- Radix Switch Dependency
- Radix Toggle Dependency
- Radix Toggle Group Dependency
- Radix Tooltip Dependency
- React Day Picker Dependency
- React DOM Dependency
- React Hook Form Dependency
- React PDF Renderer Dependency
- React Resizable Panels Dependency
- React Router Dependency
- Recharts Dependency
- Sonner Toast Dependency
- Tailwind Animate Dependency
- TanStack Query Dependency
- Vaul Drawer Dependency
- Zod Validation Dependency
- CareerGenie Brand Logo Concept
- Vercel Deployment Config
- Confusion Matrix Figure
- Feature Importance Figure
- README: Resume Builder Feature
- README: Roadmap Feature
- README: Senior Instructor Feature
- Genie Logo Variant 2
- Genie Logo Variant 3

## God Nodes (most connected - your core abstractions)
1. `cn()` - 105 edges
2. `loadData()` - 28 edges
3. `useAuth()` - 23 edges
4. `saveData()` - 23 edges
5. `ResumeData` - 20 edges
6. `compilerOptions` - 19 edges
7. `CareerGenie Audit Fixes Implementation Plan` - 19 edges
8. `splitBullets()` - 15 edges
9. `bullets()` - 15 edges
10. `buildUserContext()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `useCarousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useChart()` --references--> `react`  [EXTRACTED]
  src/components/ui/chart.tsx → package.json
- `useFormField()` --references--> `react`  [EXTRACTED]
  src/components/ui/form.tsx → package.json
- `ML Backend (FastAPI Random Forest)` --conceptually_related_to--> `FastAPI Service (app.py)`  [INFERRED]
  README.md → ml-service/README.md
- `ML Backend (FastAPI Random Forest)` --conceptually_related_to--> `Random Forest Classifier`  [INFERRED]
  README.md → ml-service/README.md

## Import Cycles
- None detected.

## Communities (132 total, 64 thin omitted)

### Community 0 - "Career Matching & Dropdown Menu"
Cohesion: 0.07
Nodes (66): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+58 more)

### Community 1 - "Resume Templates (PDF)"
Cohesion: 0.09
Nodes (47): classic, creative, executive, minimal, modern, contactLine(), splitBullets(), stripBulletMarker() (+39 more)

### Community 2 - "ESLint & Dev Tooling Deps"
Cohesion: 0.04
Nodes (49): autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom, lovable-tagger (+41 more)

### Community 3 - "App Shell & Routing"
Cohesion: 0.06
Nodes (28): About, App(), AssessmentPage, CareersPage, ChatPage, Contact, DashboardHome, DashboardLayout (+20 more)

### Community 4 - "Animated Text Effects"
Cohesion: 0.08
Nodes (29): AnimatedContent(), AnimatedContentProps, BlurText(), BlurTextProps, buildKeyframes(), Snapshot, animateValue(), BorderGlow() (+21 more)

### Community 5 - "ML Service Backend (FastAPI)"
Cohesion: 0.08
Nodes (31): BaseModel, DataFrame, get_model(), health(), meta(), predict(), Prediction, PredictRequest (+23 more)

### Community 6 - "Avatar & Form Controls"
Cohesion: 0.06
Nodes (21): NavLink, NavLinkCompatProps, Avatar, AvatarFallback, AvatarImage, Checkbox, HoverCardContent, InputOTP (+13 more)

### Community 7 - "Sidebar & Separator Components"
Cohesion: 0.07
Nodes (26): Separator, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel (+18 more)

### Community 8 - "Documentation: Feature Overview"
Cohesion: 0.12
Nodes (28): AI Bullet Rewriter, AI Career Chat Mentor, lib/ai.ts (LLM proxy helpers), api/ai/complete.ts serverless proxy, AI-driven ATS Scoring, AuthContext.tsx, C4 Architecture Model (Context/Container/Component), Career Assessment Engine (+20 more)

### Community 9 - "Firebase Auth Context"
Cohesion: 0.14
Nodes (20): AuthContext, AuthContextType, AuthProvider(), app, auth, db, firebaseConfig, anonId() (+12 more)

### Community 10 - "Career Tech Stack & Roadmap"
Cohesion: 0.15
Nodes (20): TechStackPanel(), TechStackPanelProps, ALIASES, CAREER_STACKS, flattenStack(), getStack(), isKnown(), StackGroup (+12 more)

### Community 11 - "TypeScript App Config"
Cohesion: 0.08
Nodes (25): DOM, DOM.Iterable, ES2020, src, vitest/globals, compilerOptions, allowImportingTsExtensions, isolatedModules (+17 more)

### Community 12 - "Interview Simulator & Voice Recorder"
Cohesion: 0.17
Nodes (16): Progress, transcribeAudio(), useVoiceRecorder(), Answer, DIFFICULTIES, Difficulty, evaluateAnswer(), generateQuestions() (+8 more)

### Community 13 - "Auth Forms & Base UI Inputs"
Cohesion: 0.17
Nodes (12): GlowOrbs(), Button, ButtonProps, Input, Label, labelVariants, Textarea, TextareaProps (+4 more)

### Community 14 - "Instructor Chat & Quiz Tools"
Cohesion: 0.17
Nodes (19): buildUserContext(), ChatMsg, generateQuiz(), instructorChat(), loadChat(), personaFor(), ProgressReview, QuizQuestion (+11 more)

### Community 15 - "Daily Task Reminder"
Cohesion: 0.25
Nodes (20): DailyTaskReminder(), pad(), DailyTask, generateDailyTask(), getTodayTask(), loadLastNotified(), loadReminderTime(), missedTaskCount() (+12 more)

### Community 16 - "package.json Scripts & Metadata"
Cohesion: 0.09
Nodes (21): name, overrides, jwks-rsa, private, scripts, build, build:dev, dev (+13 more)

### Community 17 - "ML Service README"
Cohesion: 0.10
Nodes (21): Algorithm Comparison (RF/GB/KNN/LogReg), career_data.py dataset generator, FastAPI Service (app.py), GET /health endpoint, GET /meta endpoint, CalibratedClassifierCV Calibration, model_meta.json, POST /predict endpoint (+13 more)

### Community 18 - "Codebase Audit Fix Plan"
Cohesion: 0.15
Nodes (20): Phase 2: Move Groq LLM calls behind authenticated backend proxy, CareerGenie Audit Fixes Implementation Plan, Task 10: Stop stale voice transcripts landing on wrong interview question, Task 11: Validate roadmap resourceUrl before rendering as a link (XSS), Task 12: Fix missing education detail field in Executive & Vibrant PDF templates, Task 13: Fix tech-stack 'known skills' tokenizer (isKnown), Task 14: Fix stale confidence when ML predictions filtered for unknown labels, Task 15: Fix Assessment.tsx touchedSkills seeding (+12 more)

### Community 19 - "Calendar, Pagination & Button UI"
Cohesion: 0.18
Nodes (15): buttonVariants, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem, PaginationLink() (+7 more)

### Community 20 - "Vite/Node TS Config"
Cohesion: 0.11
Nodes (17): ES2023, vite.config.ts, compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection (+9 more)

### Community 21 - "Hero Showcase Previews"
Cohesion: 0.14
Nodes (13): AssessmentPreview(), CARDS, CareerMatchPreview(), HeroShowcase(), InstructorPreview(), RoadmapPreview(), stackShift(), DialogContent (+5 more)

### Community 22 - "shadcn/ui Components Config"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 23 - "Dashboard Layout & Bar Trend"
Cohesion: 0.21
Nodes (12): BarTrend(), BarTrendItem, DashboardLayout(), navItems, Iridescence(), IridescenceProps, useAuth(), hasPendingTaskToday() (+4 more)

### Community 24 - "Cloudflare Pages Functions Port Plan"
Cohesion: 0.23
Nodes (15): bun (project package manager), Cloudflare Pages deployment (career-genie.pages.dev), Decision to avoid firebase-admin in functions/, functions/api/ai/complete.ts (onRequestPost chat completion), functions/api/ai/transcribe.ts (onRequestPost audio transcription), functions/api/_lib/auth.ts (requireUser / AuthError), functions/api/_lib/http.ts (jsonResponse helper), Google public JWKS endpoint (securetoken@system.gserviceaccount.com) (+7 more)

### Community 25 - "Animation & Radix UI Deps"
Cohesion: 0.15
Nodes (14): gsap, motion, dependencies, gsap, motion, @radix-ui/react-label, @radix-ui/react-slider, @radix-ui/react-tabs (+6 more)

### Community 26 - "AI Proxy API Routes"
Cohesion: 0.29
Nodes (9): groq, handler(), config, handler(), adminAuth(), AuthError, requireUser(), ALLOWED_ORIGINS (+1 more)

### Community 27 - "Carousel Component"
Cohesion: 0.15
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 28 - "Site Entry Point & Robots.txt"
Cohesion: 0.17
Nodes (11): Lovable Platform Reference, main.tsx Module Script, Meta Description Tag, Open Graph & Twitter Card Meta Tags, index.html Entry Point, #root Div Element, Bingbot Crawl Rule, facebookexternalhit Crawl Rule (+3 more)

### Community 30 - "Menubar Component"
Cohesion: 0.17
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 31 - "ML Service Dependencies (requirements/runtime)"
Cohesion: 0.22
Nodes (11): FastAPI, joblib, NumPy, pandas, Pydantic, pytest, ml-service requirements.txt, scikit-learn (+3 more)

### Community 32 - "Command Palette UI"
Cohesion: 0.18
Nodes (9): Command, CommandDialogProps, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 33 - "Form Component"
Cohesion: 0.18
Nodes (9): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+1 more)

### Community 34 - "Root TypeScript Config"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 35 - "Chart Component"
Cohesion: 0.20
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 36 - "Context Menu Component"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 37 - "ML Pipeline Diagram"
Cohesion: 0.33
Nodes (9): Career Roadmap, Feature Vector (21 features, 0..1), LLM Explanation (Groq), CareerGenie ML Pipeline Diagram, Personality Assessment (12 items), Random Forest Classifier (FastAPI), Ranked Careers + Probabilities, Skill Assessment (15 skills) (+1 more)

### Community 38 - "React Hook Usage Across UI Primitives"
Cohesion: 0.22
Nodes (8): react, react, useCarousel(), useChart(), useFormField(), SidebarContext, useSidebar(), useIsMobile()

### Community 39 - "Alert Dialog Component"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 40 - "Sheet Component"
Cohesion: 0.22
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 41 - "Table Component"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 42 - "System Architecture Diagram"
Cohesion: 0.39
Nodes (8): Client (Browser), Cloud Services, FastAPI ML Service (Random Forest), Firebase Authentication, Groq LLM API (llama-3.3-70b), localStorage (per-user data), System Architecture Diagram (Client-Cloud), React + Vite + TypeScript (Tailwind, shadcn/ui)

### Community 43 - "Breadcrumb Component"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 44 - "Drawer Component"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 45 - "Navigation Menu Component"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 46 - "Select Component"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 47 - "Card Component"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 48 - "Toggle & Toggle Group"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 49 - "Algorithm Comparison Chart"
Cohesion: 0.70
Nodes (5): Gradient Boosting (94.3% 5-fold CV accuracy), K-Nearest Neighbors (95.6% 5-fold CV accuracy), Logistic Regression (96.0% 5-fold CV accuracy), Algorithm Comparison Chart (5-fold CV Accuracy, chosen model in gold), Random Forest (chosen ML model, 95.1% 5-fold CV accuracy)

### Community 50 - "System Context Diagram"
Cohesion: 0.40
Nodes (5): Administrator (External Entity), Career Genie System (Context Diagram Process), Firebase (Auth / Identity), Groq LLM API (External NLP), Student / User (External Entity)

### Community 51 - "Entity-Relationship Diagram"
Cohesion: 0.50
Nodes (5): Assessment (entity: uid FK, personalityAnswers, skillRatings, completedAt), InterviewSession (entity: uid FK, role, difficulty, answers[], overallScore), Prediction (entity: uid FK, predictions[], topCareer, source), Roadmap (entity: uid FK, goal, phases[], completionDates[]), User (entity: uid PK, email, displayName, emailVerified)

### Community 53 - "Dashboard Stat Card"
Cohesion: 0.60
Nodes (3): StatCard(), StatCardProps, useCountUp()

### Community 54 - "Alert Component"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 56 - "Accordion Component"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 57 - "Badge Component"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

## Knowledge Gaps
- **472 isolated node(s):** `AuthError`, `groq`, `config`, `$schema`, `style` (+467 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **64 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Animation & Radix UI Deps` to `package.json Scripts & Metadata`, `React Hook Usage Across UI Primitives`, `class-variance-authority Dependency`, `clsx Dependency`, `cmdk Dependency`, `date-fns Dependency`, `EmailJS Dependency`, `Embla Carousel Dependency`, `Firebase Client SDK Dependency`, `Firebase Admin SDK Dependency`, `Inter Font Dependency`, `Plus Jakarta Sans Font Dependency`, `Space Grotesk Font Dependency`, `Groq SDK Dependency`, `React Hook Form Resolvers Dependency`, `Input OTP Dependency`, `Lucide Icons Dependency`, `next-themes Dependency`, `OGL WebGL Dependency`, `Radix Accordion Dependency`, `Radix Alert Dialog Dependency`, `Radix Aspect Ratio Dependency`, `Radix Avatar Dependency`, `Radix Checkbox Dependency`, `Radix Collapsible Dependency`, `Radix Context Menu Dependency`, `Radix Dialog Dependency`, `Radix Dropdown Menu Dependency`, `Radix Hover Card Dependency`, `Radix Menubar Dependency`, `Radix Navigation Menu Dependency`, `Radix Popover Dependency`, `Radix Progress Dependency`, `Radix Radio Group Dependency`, `Radix Scroll Area Dependency`, `Radix Select Dependency`, `Radix Separator Dependency`, `Radix Slot Dependency`, `Radix Switch Dependency`, `Radix Toggle Dependency`, `Radix Toggle Group Dependency`, `Radix Tooltip Dependency`, `React Day Picker Dependency`, `React DOM Dependency`, `React Hook Form Dependency`, `React PDF Renderer Dependency`, `React Resizable Panels Dependency`, `React Router Dependency`, `Recharts Dependency`, `Sonner Toast Dependency`, `Tailwind Animate Dependency`, `TanStack Query Dependency`, `Vaul Drawer Dependency`, `Zod Validation Dependency`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **Why does `cn()` connect `Calendar, Pagination & Button UI` to `Career Matching & Dropdown Menu`, `Resume Templates (PDF)`, `App Shell & Routing`, `Avatar & Form Controls`, `Sidebar & Separator Components`, `Firebase Auth Context`, `Career Tech Stack & Roadmap`, `Interview Simulator & Voice Recorder`, `Auth Forms & Base UI Inputs`, `Instructor Chat & Quiz Tools`, `Daily Task Reminder`, `Hero Showcase Previews`, `Dashboard Layout & Bar Trend`, `Carousel Component`, `Menubar Component`, `Command Palette UI`, `Form Component`, `Chart Component`, `Context Menu Component`, `Alert Dialog Component`, `Sheet Component`, `Table Component`, `Breadcrumb Component`, `Drawer Component`, `Navigation Menu Component`, `Select Component`, `Card Component`, `Toggle & Toggle Group`, `Alert Component`, `Accordion Component`, `Badge Component`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `react` connect `React Hook Usage Across UI Primitives` to `Animation & Radix UI Deps`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **What connects `AuthError`, `groq`, `config` to the rest of the system?**
  _472 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Career Matching & Dropdown Menu` be split into smaller, more focused modules?**
  _Cohesion score 0.06596491228070175 - nodes in this community are weakly interconnected._
- **Should `Resume Templates (PDF)` be split into smaller, more focused modules?**
  _Cohesion score 0.08819875776397515 - nodes in this community are weakly interconnected._
- **Should `ESLint & Dev Tooling Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._