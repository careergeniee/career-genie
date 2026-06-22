# Career Genie — AI-Powered Career Guidance Platform
## Final Year Project Documentation

---

**University of Management and Technology (UMT), Lahore**  
School of Systems and Technology  
Department of Software Engineering

---

| Field | Details |
|-------|---------|
| **Project Title** | Career Genie — AI-Powered Career Guidance Platform |
| **Submitted By** | Meraj [Last Name] · Muhammad Taha · Haroon [Last Name] |
| **Session** | 2022–2026 |
| **Project Supervisor** | [Supervisor Name] |
| **Department** | Software Engineering |
| **School** | School of Systems and Technology |
| **Submission Date** | June 2026 |

---

## Dedication

*This work is dedicated to our parents and families, whose unwavering support and prayers made this journey possible. We also dedicate this to every Pakistani student who deserves better career guidance but has never had access to it — this platform was built for you.*

---

## Final Approval

This is to certify that the Final Year Project titled **"Career Genie — AI-Powered Career Guidance Platform"** submitted by **Meraj [Last Name]**, **Muhammad Taha**, and **Haroon [Last Name]** has been examined and approved as meeting the requirements for the degree of Bachelor of Science in Software Engineering at the University of Management and Technology, Lahore.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Supervisor | [Supervisor Name] | _________ | June 2026 |
| Internal Examiner | [Examiner Name] | _________ | June 2026 |
| External Examiner | [Examiner Name] | _________ | June 2026 |
| HoD, Software Engineering | [HoD Name] | _________ | June 2026 |

---

## Acknowledgments

We extend our deepest gratitude to our project supervisor, **[Supervisor Name]**, for their invaluable guidance, constructive feedback, and consistent encouragement throughout the development of Career Genie. Their mentorship shaped both the technical depth and academic rigour of this project.

We thank the **Department of Software Engineering** at UMT Lahore for providing the academic foundation and computing resources that made this project possible.

We are grateful to the open-source community — the maintainers of React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and @react-pdf/renderer — whose tools formed the backbone of our platform. We also thank **Groq** for providing generous API access and **Firebase** for authentication services.

Finally, we thank our beta testers — students and recent graduates — who gave honest feedback during the testing phase and helped us improve every feature.

---

## Abstract

Career Genie is an AI-powered web-based career guidance platform designed to address the acute shortage of accessible, personalized career counseling for university students and early-career professionals in Pakistan. Pakistani graduates entering an increasingly competitive job market often lack professional resume writing skills, interview preparation experience, awareness of in-demand skills, and structured career roadmaps. Traditional career counseling is expensive, geographically limited, and generic.

Career Genie tackles these gaps through ten integrated modules: an AI Career Chat Mentor powered by Meta's Llama 3.3-70b language model, a six-template Resume Builder with PDF export, AI-driven ATS (Applicant Tracking System) scoring, and AI bullet rewriting; a Career Assessment engine that profiles user personality and technical skills; a Machine Learning–based Career Path Prediction system using a Random Forest classifier with a local fallback; a Skill Gap Analysis tool; a personalized AI-generated Career Roadmap with gamified progress tracking; and a voice-enabled Mock Interview Simulator with real-time scoring.

The platform is built on React 18 with TypeScript, Vite, and Tailwind CSS for the frontend; Firebase Authentication for identity management; the Groq API for large language model inference; and a FastAPI backend for the ML prediction service. All user data is stored client-side in localStorage with a Firestore migration path planned.

Career Genie demonstrates that AI can democratize career guidance at scale — delivering personalized, context-aware support to students who cannot afford professional counselors, while keeping the experience simple, fast, and accessible on any device with a modern browser.

**Keywords:** Artificial Intelligence, Career Guidance, Natural Language Processing, Resume Builder, Machine Learning, Career Prediction, Skill Gap Analysis, Pakistani Job Market, Web Application, React.

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Background and Context
   - 1.2 Problem Statement
   - 1.3 Project Objectives
   - 1.4 Project Scope
   - 1.5 Significance of the Work
   - 1.6 AI and ML Features Overview
   - 1.7 Deliverables
2. [Domain Analysis](#2-domain-analysis)
   - 2.1 Customer Profile
   - 2.2 Stakeholders
   - 2.3 Affected Groups
   - 2.4 System Dependencies
   - 2.5 Related and Similar Systems
   - 2.6 Context Diagram
   - 2.7 Level-0 Data Flow Diagram
   - 2.8 Level-1 Data Flow Diagrams
3. [Requirements Analysis](#3-requirements-analysis)
   - 3.1 List of Actors
   - 3.2 Product Backlog — User Stories
   - 3.3 Figma Prototype
4. [Project Planning](#4-project-planning)
   - 4.1 Development Tools and Technologies
   - 4.2 Sprint 1 — Authentication, Dashboard, and Landing Page
   - 4.3 Sprint 2 — Resume Builder
   - 4.4 Sprint 3 — AI Career Chat and Career Assessment
   - 4.5 Sprint 4 — Career Prediction and Skill Gap Analysis
   - 4.6 Sprint 5 — Career Roadmap and Mock Interview Simulator
   - 4.7 Sprint 6 — Integration, Testing, and Polish
5. [System Architecture](#5-system-architecture)
   - 5.1 C4 Context Diagram
   - 5.2 C4 Container Diagram
   - 5.3 C4 Component Diagram
   - 5.4 Entity-Relationship Diagram
   - 5.5 Data Dictionary
6. [Implementation Details](#6-implementation-details)
   - 6.1 Development Environment Setup
   - 6.2 Module-by-Module Implementation
   - 6.3 AI and ML Integration
   - 6.4 Key Code Excerpts
7. [Project Monitoring](#7-project-monitoring)
   - 7.1 Requirements Traceability Matrix
8. [Results and Output](#8-results-and-output)
   - 8.1 Feature Completion Summary
   - 8.2 Performance Observations
   - 8.3 Sample Outputs
9. [Conclusion](#9-conclusion)
10. [Future Work](#10-future-work)
11. [Bibliography](#11-bibliography)
12. [Appendix](#12-appendix)
    - 12.1 Glossary
    - 12.2 API References

---

## 1. Introduction

### 1.1 Background and Context

Pakistan is home to one of the world's youngest populations, with over 64% of its 230+ million citizens under the age of 30 (Pakistan Bureau of Statistics, 2023). Each year, hundreds of thousands of students graduate from Pakistani universities, entering a job market that is simultaneously growing in its digital and technology sectors yet severely lacking in structured career support infrastructure.

In developed economies, students benefit from dedicated university career centers, professional resume writing services, mock interview coaching, and AI-powered platforms such as LinkedIn Career Explorer and Coursera Career Academy. In Pakistan, such services are either prohibitively expensive for the average student, geographically concentrated in major cities, or so generic in their advice that they fail to provide actionable personalized guidance.

Globally, artificial intelligence is transforming career development. Large language models (LLMs) such as GPT-4 and LLaMA are enabling personalized career counseling at scale. Machine learning classifiers can predict career fit with remarkable accuracy when trained on personality and skills profiles. Automated resume scoring tools help candidates optimize their applications before submission. These technologies, applied thoughtfully, have the potential to provide every student — regardless of their economic background or geographic location — with career guidance that rivals that available to the most privileged graduates.

Career Genie was conceived at this intersection: the gap between the career guidance needs of Pakistani students and the transformative capability of modern AI tools. The platform brings together an AI career chat mentor, resume intelligence, personality-driven career prediction, skill gap analysis, personalized roadmap generation, and AI-simulated mock interviews into a single, cohesive, web-based application.

### 1.2 Problem Statement

Despite the availability of individual digital tools (job portals, resume templates, online courses), Pakistani students and early-career professionals face a fragmented and inadequate career guidance ecosystem. The specific problems are:

1. **Lack of personalized career mentorship.** Generic career advice does not account for individual personality, skills, interests, or the specific realities of the Pakistani job market. Professional career counselors charge fees that are out of reach for most students.

2. **Poor resume quality.** Most students submit resumes that are not optimized for Applicant Tracking Systems (ATS). A 2019 study by Jobscan found that 98% of Fortune 500 companies use ATS, and Pakistan's multinational employers follow the same pattern. Students lack the knowledge to write achievement-focused, keyword-rich bullet points.

3. **Inadequate interview preparation.** Mock interviews require a human partner or expensive coaching. Students enter real interviews under-prepared, lacking experience in structured question-answering, time management, and receiving constructive feedback.

4. **No awareness of skill gaps.** Students often do not know which specific skills are required for their target career or how their current proficiency compares to industry expectations.

5. **Absence of structured, personalized learning roadmaps.** Online learning platforms offer thousands of courses but no personalized sequencing. Students do not know what to learn, in what order, and how long each phase should take.

6. **No integrated platform.** Existing tools address individual problems in isolation. A student must use a separate resume builder, a separate job portal, a separate course platform, and a separate AI chatbot — none of which are contextually connected or tailored to Pakistan.

Career Genie addresses all six of these problems within a single, integrated platform.

### 1.3 Project Objectives

The following seven measurable objectives guided the development of Career Genie:

1. **Objective 1 — AI Career Mentorship:** Develop an AI-powered career chat mentor, trained with a Pakistani job market context, capable of answering natural language questions about career paths, skills, salaries, certifications, and higher education, with full conversation history and voice input support.

2. **Objective 2 — Resume Intelligence:** Build a multi-template resume builder with live preview, PDF export, AI-driven ATS scoring against a user-specified target role, and an AI bullet-point rewriting engine that produces achievement-focused, quantified, ATS-friendly resume bullets.

3. **Objective 3 — Career Assessment:** Implement a structured career assessment instrument combining Likert-scale personality questions (mapped to professional personality traits) and technical skill self-rating, producing a normalized feature vector that represents the user's career profile.

4. **Objective 4 — Career Path Prediction:** Deploy a machine learning career prediction system that accepts the assessment feature vector and returns the top five most suitable careers with probability scores, confidence metrics, and algorithm attribution, using a Random Forest model served via FastAPI with a local cosine-similarity fallback.

5. **Objective 5 — Skill Gap Analysis:** Derive a per-career skill gap report from the user's assessed skill levels compared against curated career-specific skill requirements, categorizing each skill as Strong, Developing, or Missing.

6. **Objective 6 — Career Roadmap Generation:** Use a large language model to generate personalized, multi-phase career roadmaps tailored to the user's goal and current skills, with curated technology stacks, real learning resource links, task-level progress tracking, and a daily streak gamification system.

7. **Objective 7 — Mock Interview Simulation:** Implement a voice-enabled mock interview simulator that generates role-specific and difficulty-adjusted questions, enforces a two-minute answer timer, and uses an AI evaluator to score each answer, provide feedback, and suggest ideal answer structure.

### 1.4 Project Scope

**In-Scope:**

- A web-based single-page application (SPA) accessible on any modern browser (Chrome, Firefox, Edge, Safari)
- User authentication (registration, login, logout, profile management) via Firebase Authentication
- Ten integrated modules: Landing Page, Authentication, Dashboard, AI Career Chat, Resume Builder, Career Assessment, Career Path Prediction, Skill Gap Analysis, Career Roadmap, Mock Interview Simulator, and Settings
- AI inference via the Groq API (Llama 3.3-70b-versatile model) for chat, roadmap generation, and interview evaluation
- Voice input via the Groq Whisper API and the Web Speech API
- Client-side data persistence via localStorage, scoped per authenticated user
- PDF resume export via the @react-pdf/renderer library
- A FastAPI-based ML backend for Random Forest career prediction (deployed separately)
- Responsive design supporting desktop and mobile browsers

**Out-of-Scope:**

- A native mobile application (iOS/Android) — the web app is responsive but not native
- A job board or direct employer integration
- Real recruiter or mentor matching
- Payment processing or premium subscription tiers in this version
- Server-side rendering (SSR) or backend web server beyond the ML API
- Automated email notifications or push notifications
- Admin panel or moderation interface
- Multi-language support (Urdu) — English only in this version

**Target Users:**

Primary: Pakistani university students (undergraduate and postgraduate) in STEM and business disciplines, aged 18–28.  
Secondary: Recent graduates (0–3 years of experience) seeking career direction or job market entry support.

### 1.5 Significance of the Work

Career Genie's significance is multi-dimensional:

**Democratization of career guidance.** By combining an AI career mentor, ML-based career prediction, resume intelligence, and interview practice in a free, browser-based platform, Career Genie makes professional-grade career support accessible to every student with internet access — not just those who can afford coaching.

**Pakistani market specialization.** Unlike generic Western platforms, Career Genie's AI chat system is prompted with Pakistani job market context, its career prediction model is trained on regional career data, and its roadmap resources are sourced from free platforms popular among Pakistani students (freeCodeCamp, Coursera, YouTube, roadmap.sh).

**Integrated experience.** Assessment results feed into career prediction, which feeds into skill gap analysis, which feeds into roadmap generation. This connected architecture means the platform gets smarter and more personalized as users engage with more features.

**AI/ML applied to a real social problem.** Career Genie demonstrates practical, ethical application of large language models and classical ML to a social problem with measurable impact — graduate unemployment and under-employment in Pakistan.

### 1.6 AI and ML Features Overview

| Feature | AI/ML Method | Model/Algorithm |
|---------|-------------|-----------------|
| AI Career Chat | Large Language Model (LLM) chat | Meta Llama 3.3-70b via Groq API |
| Voice Input (Chat + Interview) | Speech-to-text | Groq Whisper API |
| Resume ATS Scoring | LLM-as-evaluator | Llama 3.3-70b via Groq (structured JSON output) |
| AI Bullet Rewriter | LLM text transformation | Llama 3.3-70b via Groq |
| Career Prediction (primary) | Supervised classification | Random Forest — FastAPI backend |
| Career Prediction (fallback) | Similarity scoring | Cosine similarity + Softmax (local, offline) |
| Roadmap Generation | LLM structured generation | Llama 3.3-70b — JSON phases/tasks/resources |
| Interview Question Generation | LLM prompt engineering | Llama 3.3-70b via Groq |
| Interview Answer Evaluation | LLM-as-evaluator | Llama 3.3-70b — structured JSON score + feedback |

### 1.7 Deliverables

1. **Functional Web Application** — The fully working Career Genie platform deployed and accessible from a browser.
2. **Source Code Repository** — All source code hosted on GitHub at https://github.com/careergeniee/career-genie, with commit history documenting development progress.
3. **FastAPI ML Backend** — A Python FastAPI service implementing the Random Forest career prediction model.
4. **FYP Documentation** — This document, covering all phases from requirements to implementation.
5. **Figma Design Prototype** — High-fidelity UI designs for all pages created during Sprint 1.
6. **Demo Presentation** — A final demonstration presented to supervisors and examiners.

---

## 2. Domain Analysis

### 2.1 Customer Profile

The primary customer of Career Genie is the **Pakistani university student or recent graduate** who:

- Is enrolled in or has recently completed an undergraduate or postgraduate degree at a Pakistani university
- Is entering or planning to enter the professional job market in Pakistan, the Gulf, or internationally
- Has access to a computer or smartphone with internet connectivity
- Is proficient in English (the platform's primary language)
- Is motivated to improve their career prospects but lacks access to professional career counseling

**User Persona — Primary:**  
*Ali Raza, 22, Final Year Software Engineering Student, UET Lahore.*  
Ali is preparing to graduate and apply for his first job. He knows he needs to update his resume but does not know how to make it ATS-friendly. He wants to practice interviews but has no one to practice with. He is unsure whether to pursue a frontend, backend, or full-stack career. He cannot afford a career coach.

**User Persona — Secondary:**  
*Sara Ahmed, 25, BS Computer Science Graduate, 1 Year Work Experience, Karachi.*  
Sara wants to switch careers from QA to Data Science. She needs to understand her skill gaps, find the right learning roadmap, and prepare a new resume tailored to data science roles.

### 2.2 Stakeholders

| Stakeholder | Role | Interest in System |
|------------|------|-------------------|
| Students / Job Seekers | Primary users | Receive personalized career guidance, resume building, interview prep |
| Fresh Graduates | Primary users | Career direction, skill gap identification, job readiness |
| University Career Centers | Secondary beneficiaries | May recommend platform to students; reduced counselor workload |
| Employers (indirect) | Secondary beneficiaries | Better-prepared candidates in the hiring pipeline |
| Project Supervisors (UMT) | Academic oversight | Ensure technical and academic quality of deliverables |
| Development Team | Builders | Deliver a functional, high-quality platform |
| Groq (API provider) | Infrastructure partner | Provides LLM inference at low latency |
| Firebase (Google) | Infrastructure partner | Provides authentication and hosting |

### 2.3 Affected Groups

**Positively Affected:**
- Pakistani university students who gain access to AI-powered career tools they could not otherwise afford
- Recent graduates who accelerate their job search with better resumes and stronger interview performance
- University career centers that can recommend a free, high-quality supplement to their services

**Minimally Affected:**
- Professional career counselors: Career Genie targets the mass-market segment that counselors typically do not serve due to pricing; it does not directly compete for high-end coaching clients
- Employers: Benefit indirectly from better-prepared candidates

**Potentially Disrupted:**
- Generic resume template sites with no AI features (Resume.io, Canva resume) — Career Genie's AI ATS scoring and bullet rewriting provide substantially more value

### 2.4 System Dependencies

| Dependency | Type | Purpose | Fallback if Unavailable |
|-----------|------|---------|------------------------|
| Firebase Authentication | External SaaS | User registration, login, session management | None — authentication is critical path |
| Groq API (Llama 3.3-70b) | External API | LLM chat, roadmap generation, interview Q-gen and evaluation, resume ATS scoring and bullet rewriting | Graceful error messages; app still functional for non-AI features |
| Groq Whisper API | External API | Voice-to-text transcription for chat and interview | Text input fallback always available |
| FastAPI ML Backend | Custom service | Random Forest career prediction | Local cosine-similarity fallback (built into careerEngine.ts) — fully offline |
| @react-pdf/renderer | npm library | PDF generation for resume download | Error toast; preview still works |
| localStorage | Browser API | All user data persistence | Data lost on clear; Firestore migration planned |
| React + TypeScript + Vite | npm packages | Entire frontend | N/A — build-time dependency |

### 2.5 Related and Similar Systems

| System | Relevant Features | Key Differences from Career Genie |
|--------|------------------|----------------------------------|
| **LinkedIn** | Career exploration, job search, some AI writing | Not career-guidance focused; no roadmaps, no interview simulator, no career prediction ML; requires professional network to be useful; not tailored to Pakistan |
| **Rozee.pk** | Pakistani job portal, resume builder | No AI career guidance, no skill assessment, no roadmaps, no interview prep; purely a job listing site |
| **Resume.io / Zety** | Resume builder, multiple templates | No career guidance, no ATS scoring, no chat mentor, no interview prep; not free |
| **Coursera Career Academy** | Learning paths, skill-based courses | No resume builder, no AI chat mentor, no ML career prediction; requires paid subscription for full access |
| **ChatGPT / Claude (direct)** | AI career advice via chat | No structured tools (resume, assessment, roadmap), no persistent user profile, no Pakistani market context baked in, not career-specific |
| **InterviewBit / Pramp** | Technical interview practice | Code-focused (not behavioral), no resume, no career prediction, no roadmap |
| **Canva Resume** | Template-based resume builder | No AI optimization, no ATS scoring, no career guidance |

Career Genie's key differentiator is its **integrated, AI-first, Pakistan-aware platform** — it is the only solution that connects assessment → prediction → skill gap → roadmap → resume → interview practice in a single user journey.

### 2.6 Context Diagram

The Context Diagram places Career Genie at the center of its ecosystem, showing the external entities it interacts with:

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
  [Student/User] ───┼──► Career Genie Web Application        │
                    │         (React SPA)                     │
  [Guest Visitor]──►│                                         │
                    │                                         │
                    └──────┬──────────┬────────┬─────────┬───┘
                           │          │        │         │
                           ▼          ▼        ▼         ▼
                    [Firebase    [Groq API  [FastAPI  [Browser
                    Auth]        (LLM +     ML       localStorage]
                                 Whisper)]  Backend]
```

**External Entities:**
- **Student/User:** Authenticated user who interacts with all platform features
- **Guest Visitor:** Unauthenticated visitor who can view the landing page and register/login
- **Firebase Authentication:** Handles user identity; receives registration and login requests; returns authenticated sessions
- **Groq API:** Receives structured prompts; returns LLM text completions and Whisper transcriptions
- **FastAPI ML Backend:** Receives a feature vector; returns top-5 career predictions with probabilities
- **Browser localStorage:** Receives serialized user data; returns it on page load for session persistence

### 2.7 Level-0 Data Flow Diagram

The Level-0 DFD treats Career Genie as a single process and shows the major data flows:

**Inputs to the system:**
- User credentials (email, password) → Authentication
- Natural language queries → AI Chat
- Resume content (personal info, experience, education, skills, projects) → Resume Builder
- Personality and skill assessment answers → Career Engine
- Career goal and current skills description → Roadmap Generator
- Interview role/difficulty selection and verbal/textual answers → Interview Simulator

**Outputs from the system:**
- Authentication tokens / session state → User's browser
- AI career advice text → User interface
- Live resume preview (HTML) → User interface
- PDF resume file → User's device (download)
- ATS score + feedback → User interface
- Career predictions with probabilities → User interface
- Skill gap report → User interface
- Personalized roadmap with tasks and resources → User interface
- Interview scores and feedback → User interface

**Data stores:**
- D1: User Authentication Data (Firebase)
- D2: User Application Data (localStorage — resume, assessment, sessions, roadmap, prediction)

### 2.8 Level-1 Data Flow Diagrams

**Process 1.0 — Authentication:**  
User credentials flow to Firebase Auth. Firebase returns a session token. The session token is stored in the Auth Context and used to scope all localStorage keys.

**Process 2.0 — AI Career Chat:**  
User message + last 10 messages of history flow to Groq API (Llama 3.3-70b) with the Career Genie system prompt. The LLM response is appended to the conversation and saved to localStorage. For voice input, the audio blob flows to Groq Whisper, which returns a text transcript that then flows into Process 2.0.

**Process 3.0 — Resume Builder:**  
Resume form data updates are saved to localStorage (debounced 400ms). On PDF download request, the resume data + template ID flow to @react-pdf/renderer, which returns a PDF blob that is offered as a file download. For ATS scoring, resume data + target role flow to Groq API, which returns a structured JSON ATS result.

**Process 4.0 — Career Assessment + Prediction:**  
Assessment answers (Likert personality + skill ratings) flow through the feature builder to produce a normalized 40+ dimension feature vector. The vector flows to the FastAPI ML backend (or local fallback), which returns top-5 careers with probabilities. Results are saved to localStorage.

**Process 5.0 — Skill Gap Analysis:**  
The user's skill ratings + selected target career flow into the skill gap analyzer, which compares skill levels against career-specific thresholds, categorizing each skill as Strong / Developing / Missing.

**Process 6.0 — Career Roadmap:**  
The user's career goal + current skills description + curated tech stack for the goal flow to Groq API as a structured prompt. The LLM returns a JSON roadmap (phases, tasks, resource URLs). The roadmap is saved to localStorage. Task completion events update the roadmap and record completion dates for streak calculation.

**Process 7.0 — Mock Interview Simulator:**  
The selected role + difficulty level flow to Groq API to generate 10 interview questions. During the session, each answer + question + role + difficulty flow to Groq API to produce a structured JSON evaluation (score 0–10, feedback, ideal answer points). Session data is saved to localStorage on completion.

---

## 3. Requirements Analysis

### 3.1 List of Actors

| Actor | Description | Access Level |
|-------|-------------|-------------|
| **Guest Visitor** | Unauthenticated user visiting the landing page. Can view the landing page, About page, and Services page. Can navigate to registration and login. | Public pages only |
| **Registered Student** | Authenticated user with a Career Genie account. Has full access to all dashboard features. All data is scoped to their user ID. | All features |
| **System (AI Engine)** | The Groq LLM and FastAPI ML backend acting as automated actors that process requests and return structured responses. | Backend services |
| **Admin (Future)** | A system administrator who can view aggregate platform usage, manage user accounts, and update ML models. Not implemented in this version. | Admin panel (future) |

### 3.2 Product Backlog — User Stories

Stories are organized by Epic. Priority: **High** (must-have for MVP), **Medium** (should-have), **Low** (nice-to-have). Story points follow a Fibonacci scale (1, 2, 3, 5, 8).

---

#### Epic 1: Authentication

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-001 | As a new user, I want to register with my email and password so that I can create a Career Genie account. | High | 2 | Sprint 1 |
| US-002 | As a user, I want to log in with my email and password so that I can access my personalized dashboard. | High | 2 | Sprint 1 |
| US-003 | As a user, I want to log out so that my session is securely terminated. | High | 1 | Sprint 1 |
| US-004 | As a user, I want to update my display name in Settings so that the platform addresses me by name. | Medium | 1 | Sprint 1 |
| US-005 | As a user, I want to see my account metadata (creation date, email, verification status) in Settings. | Low | 1 | Sprint 1 |

#### Epic 2: Dashboard

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-006 | As a user, I want to see my roadmap progress percentage on the dashboard so that I know how far along I am. | High | 2 | Sprint 1 |
| US-007 | As a user, I want to see my total interview sessions count on the dashboard. | High | 1 | Sprint 1 |
| US-008 | As a user, I want to see my last interview score on the dashboard. | High | 1 | Sprint 1 |
| US-009 | As a user, I want to see my top predicted career match on the dashboard. | High | 2 | Sprint 1 |
| US-010 | As a user, I want quick-access navigation cards to all platform features from the dashboard. | High | 2 | Sprint 1 |

#### Epic 3: AI Career Chat

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-011 | As a user, I want to type a career question and receive an AI-generated response so that I can get instant career guidance. | High | 5 | Sprint 3 |
| US-012 | As a user, I want the AI to understand Pakistani job market context so that the advice is locally relevant. | High | 3 | Sprint 3 |
| US-013 | As a user, I want my last 100 chat messages to persist between browser sessions so that I do not lose my conversation history. | Medium | 2 | Sprint 3 |
| US-014 | As a user, I want to hold a button to speak and have my voice transcribed so that I can chat hands-free. | Medium | 3 | Sprint 3 |
| US-015 | As a user, I want to start a new chat session that clears the current conversation. | Low | 1 | Sprint 3 |

#### Epic 4: Resume Builder

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-016 | As a user, I want to enter my personal information, professional summary, education, work experience, skills, and projects into a structured form. | High | 5 | Sprint 2 |
| US-017 | As a user, I want to see a live preview of my resume that updates as I type so that I can see changes in real time. | High | 4 | Sprint 2 |
| US-018 | As a user, I want to choose from six professional resume templates (Modern, Classic, Minimal, Creative, Executive, Vibrant). | High | 5 | Sprint 2 |
| US-019 | As a user, I want to download my resume as a professionally formatted PDF file. | High | 4 | Sprint 2 |
| US-020 | As a user, I want to enter a target job role and receive an AI-generated ATS score (0–100) with strengths, improvements, and missing keywords. | High | 5 | Sprint 2 |
| US-021 | As a user, I want an AI to rewrite my job experience bullet points to be more achievement-focused and ATS-optimized. | Medium | 4 | Sprint 2 |
| US-022 | As a user, I want to reset my resume to a blank template if I want to start over. | Low | 1 | Sprint 2 |

#### Epic 5: Career Assessment

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-023 | As a user, I want to answer personality questions on a 1–5 Likert scale (e.g., "I enjoy working in teams") so that the system can profile my professional personality. | High | 5 | Sprint 3 |
| US-024 | As a user, I want to self-rate my proficiency in technical and professional skills (0–4 scale) so that the system knows my current skill level. | High | 3 | Sprint 3 |
| US-025 | As a user, I want my assessment answers to be automatically saved so that I do not have to re-take the assessment every visit. | Medium | 2 | Sprint 3 |

#### Epic 6: Career Path Prediction

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-026 | As a user, I want to see the top 5 most suitable careers for me with probability percentages so that I can make informed career decisions. | High | 5 | Sprint 4 |
| US-027 | As a user, I want to see a confidence score for the prediction so that I know how reliable the result is. | Medium | 2 | Sprint 4 |
| US-028 | As a user, I want to see which algorithm (ML model or local fallback) produced my prediction. | Low | 1 | Sprint 4 |
| US-029 | As a user, I want the career prediction to work offline (using a local model) so that the feature is available without internet connectivity to the ML backend. | Medium | 4 | Sprint 4 |

#### Epic 7: Skill Gap Analysis

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-030 | As a user, I want to select a target career and see a list of required skills compared to my current assessment scores. | High | 4 | Sprint 4 |
| US-031 | As a user, I want each skill to be categorized as Strong, Developing, or Missing so that I know where to focus my learning. | Medium | 2 | Sprint 4 |

#### Epic 8: Career Roadmap

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-032 | As a user, I want to select a career goal and describe my current skills so that an AI generates a personalized learning roadmap for me. | High | 5 | Sprint 5 |
| US-033 | As a user, I want to see the roadmap as 4–6 sequential phases with a title, summary, estimated weeks, and a list of tasks. | High | 4 | Sprint 5 |
| US-034 | As a user, I want each task to have a link to a free learning resource so that I know exactly where to study. | High | 3 | Sprint 5 |
| US-035 | As a user, I want to check off completed tasks so that I can track my progress through the roadmap. | High | 3 | Sprint 5 |
| US-036 | As a user, I want to see an overall progress percentage for my roadmap. | Medium | 2 | Sprint 5 |
| US-037 | As a user, I want to see a daily streak counter so that I am motivated to complete at least one task per day. | Medium | 3 | Sprint 5 |
| US-038 | As a user, I want to see the complete technology stack for my chosen career field so that I understand the full scope of what I need to learn. | Medium | 2 | Sprint 5 |

#### Epic 9: Mock Interview Simulator

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-039 | As a user, I want to select a job role (from 12 predefined roles or a custom role) and a difficulty level (Entry, Mid, Senior) before starting an interview. | High | 3 | Sprint 5 |
| US-040 | As a user, I want the system to generate 10 role-specific and difficulty-appropriate interview questions. | High | 5 | Sprint 5 |
| US-041 | As a user, I want a 2-minute countdown timer per question so that I practice answering under time pressure. | Medium | 2 | Sprint 5 |
| US-042 | As a user, I want to answer questions by typing text or using voice input so that I can practice in my preferred mode. | High | 4 | Sprint 5 |
| US-043 | As a user, I want each answer to be scored by AI (0–10) with 2–3 sentences of feedback. | High | 5 | Sprint 5 |
| US-044 | As a user, I want to see the ideal answer points after each question so that I can learn what a strong answer includes. | Medium | 3 | Sprint 5 |
| US-045 | As a user, I want to see my overall interview score (0–100) at the end of the session. | High | 2 | Sprint 5 |
| US-046 | As a user, I want to review and delete my past interview sessions. | Medium | 2 | Sprint 5 |

#### Epic 10: Settings

| ID | User Story | Priority | Story Points | Sprint |
|----|-----------|---------|-------------|--------|
| US-047 | As a user, I want to clear individual data categories (chat, resume, interviews, assessment, prediction, roadmap) without clearing everything. | Medium | 2 | Sprint 6 |
| US-048 | As a user, I want a "Clear All Data" option that wipes all my stored data after a confirmation dialog. | Low | 1 | Sprint 6 |

### 3.3 Figma Prototype

High-fidelity UI designs were created in Figma prior to implementation. The prototype covers all major screens:

- Landing Page (Hero, Features, CTA sections)
- Login and Registration pages
- Dashboard Home with stat cards and feature grid
- AI Career Chat interface
- Resume Builder (form + preview two-column layout)
- Career Assessment questionnaire
- Career Prediction results page
- Skill Gap Analysis view
- Career Roadmap (phase timeline + progress)
- Mock Interview Simulator (setup, active Q&A, results)
- Settings page

*Figma link: [Insert Figma Prototype URL here]*

---

## 4. Project Planning

### 4.1 Development Tools and Technologies

| Category | Tool / Technology | Purpose |
|---------|------------------|---------|
| **IDE** | Visual Studio Code | Primary code editor with ESLint, Prettier, TypeScript extensions |
| **Version Control** | Git + GitHub | Source code versioning, team collaboration, pull requests |
| **Frontend Framework** | React 18 + TypeScript | Component-based UI with type safety |
| **Build Tool** | Vite 5 | Fast development server and optimized production builds |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible pre-built components |
| **PDF Generation** | @react-pdf/renderer | Declarative PDF creation from React components |
| **Authentication** | Firebase Auth (Google) | Secure email/password authentication |
| **AI Inference** | Groq API | Ultra-low-latency LLM inference (Llama 3.3-70b + Whisper) |
| **ML Backend** | FastAPI (Python) | Serves Random Forest model for career prediction |
| **ML Library** | scikit-learn | Random Forest classifier training and inference |
| **UI Design** | Figma | Wireframes and high-fidelity prototype |
| **Team Communication** | WhatsApp / Discord | Daily standups, code review discussion |
| **Package Manager** | npm | Dependency management |
| **Linting** | ESLint | Code quality enforcement |
| **Deployment** | Vercel / Firebase Hosting | Frontend deployment |

### 4.2 Sprint 1 — Authentication, Dashboard, and Landing Page
**Duration:** Weeks 1–2  
**Goal:** Functional user authentication, responsive landing page, and dashboard skeleton.

| Task | Assigned To | Story Points | Status |
|------|------------|-------------|--------|
| Design Figma wireframes for all screens | Haroon | 8 | Done |
| Set up React + TypeScript + Vite project | Taha | 2 | Done |
| Configure Tailwind CSS and shadcn/ui | Haroon | 2 | Done |
| Implement Firebase Authentication (register, login, logout) | Meraj | 5 | Done |
| Build AuthContext with onAuthStateChanged | Meraj | 3 | Done |
| Build landing page (Hero, Features, Highlights sections) | Haroon | 5 | Done |
| Build Navbar with auth state | Haroon | 2 | Done |
| Build DashboardLayout with sidebar navigation | Haroon | 3 | Done |
| Build Dashboard Home page with stat cards | Taha | 3 | Done |
| Build Settings page (profile edit, data clear) | Taha | 3 | Done |
| Build userStore.ts (loadData / saveData) | Meraj | 2 | Done |
| Set up React Router v6 with protected routes | Meraj | 2 | Done |

**Sprint 1 Velocity:** 40 story points

### 4.3 Sprint 2 — Resume Builder
**Duration:** Weeks 3–4  
**Goal:** Fully functional resume builder with 6 templates, live preview, PDF export, and AI features.

| Task | Assigned To | Story Points | Status |
|------|------------|-------------|--------|
| Design and implement 6 resume templates (HTML preview) | Haroon | 10 | Done |
| Design and implement 6 resume templates (PDF via react-pdf) | Taha | 10 | Done |
| Build ResumeForm (personal, education, experience, skills, projects) | Taha | 8 | Done |
| Build live preview sync between form and preview | Taha | 4 | Done |
| Implement PDF download (react-pdf blob + anchor download) | Taha | 4 | Done |
| Implement AI ATS scoring (scoreResume function) | Meraj | 5 | Done |
| Implement AI bullet rewriting (rewriteBullets function) | Meraj | 4 | Done |
| Implement resume autosave to localStorage | Taha | 2 | Done |
| Template selector UI with previews | Haroon | 3 | Done |

**Sprint 2 Velocity:** 50 story points

### 4.4 Sprint 3 — AI Career Chat and Career Assessment
**Duration:** Weeks 5–6  
**Goal:** Functioning AI chat mentor with voice input and career assessment questionnaire.

| Task | Assigned To | Story Points | Status |
|------|------------|-------------|--------|
| Integrate Groq SDK and configure API client | Meraj | 2 | Done |
| Build Chat page with message list and input form | Haroon | 5 | Done |
| Implement AI response with conversation history (last 10 messages) | Meraj | 5 | Done |
| Implement useVoiceRecorder hook (MediaRecorder + Groq Whisper) | Meraj | 5 | Done |
| Implement press-and-hold mobile / click-to-toggle desktop voice UX | Meraj | 3 | Done |
| Implement chat persistence in localStorage (last 100 messages) | Taha | 2 | Done |
| Design Career Assessment UI (personality + skills sections) | Haroon | 4 | Done |
| Implement personality questions (12+ Likert questions) | Taha | 5 | Done |
| Implement skill self-rating section (20+ skills) | Taha | 3 | Done |
| Build feature builder (traitScore, buildFeatures functions) | Meraj | 5 | Done |
| Implement assessment save/load in localStorage | Meraj | 2 | Done |

**Sprint 3 Velocity:** 41 story points

### 4.5 Sprint 4 — Career Prediction and Skill Gap Analysis
**Duration:** Weeks 7–8  
**Goal:** ML-based career prediction with confidence scoring and visual skill gap analysis.

| Task | Assigned To | Story Points | Status |
|------|------------|-------------|--------|
| Train Random Forest model on career dataset | Meraj | 8 | Done |
| Build FastAPI backend to serve predictions | Meraj | 5 | Done |
| Implement predictCareers() with API call + timeout + retry | Meraj | 5 | Done |
| Build local fallback scorer (cosine similarity + softmax) | Meraj | 8 | Done |
| Implement confidence scoring and uncertainty flag | Meraj | 3 | Done |
| Build Career Prediction results UI (top-5 chart + confidence) | Haroon | 5 | Done |
| Build Skill Gap Analysis view (required vs. current skills) | Haroon + Taha | 5 | Done |
| Implement analyzeSkillGap() function | Taha | 4 | Done |
| Wire prediction and skill gap to localStorage persistence | Taha | 2 | Done |

**Sprint 4 Velocity:** 45 story points

### 4.6 Sprint 5 — Career Roadmap and Mock Interview Simulator
**Duration:** Weeks 9–10  
**Goal:** AI-generated personalized roadmaps and full mock interview simulator with voice.

| Task | Assigned To | Story Points | Status |
|------|------------|-------------|--------|
| Build Roadmap page UI (goal input, phase timeline) | Haroon | 5 | Done |
| Implement generateRoadmap() with LLM structured JSON prompt | Meraj | 8 | Done |
| Implement curated tech stacks for 10 career paths | Taha | 3 | Done |
| Implement task completion toggle and progress bar | Taha | 3 | Done |
| Implement streak calculation (currentStreak function) | Meraj | 3 | Done |
| Build tech stack panel with known/unknown tech highlighting | Haroon | 3 | Done |
| Build Interview Simulator setup page (role + difficulty selection) | Haroon | 3 | Done |
| Implement generateQuestions() function | Taha | 5 | Done |
| Build active interview UI (question, answer, timer, voice) | Haroon + Taha | 5 | Done |
| Implement 2-minute countdown timer logic | Taha | 2 | Done |
| Implement evaluateAnswer() function | Taha | 5 | Done |
| Build interview results page (per-question breakdown) | Haroon | 4 | Done |
| Build past sessions list with delete | Taha | 3 | Done |
| Wire voice input for interview (Web Speech API) | Meraj | 4 | Done |

**Sprint 5 Velocity:** 56 story points

### 4.7 Sprint 6 — Integration, Testing, and Polish
**Duration:** Weeks 11–12  
**Goal:** Integration testing of all features, bug fixes, performance optimization, and documentation.

| Task | Assigned To | Story Points | Status |
|------|------------|-------------|--------|
| End-to-end integration testing of all 10 features | All | 8 | Done |
| Fix Executive template PDF sidebar wrapping and spacing | Taha | 3 | Done |
| Apply consistent spacing improvements to all 6 PDF templates | Taha | 5 | Done |
| Mobile responsiveness audit and fixes | Haroon | 5 | Done |
| Performance audit (bundle size, Lighthouse score) | Meraj | 3 | Done |
| TypeScript strict mode clean-up | Taha | 3 | Done |
| Write FYP documentation | All | 8 | Done |
| Prepare final demo presentation | All | 5 | Done |
| Deploy to Vercel | Meraj | 2 | Done |

**Sprint 6 Velocity:** 42 story points

**Total Project Velocity:** 274 story points across 12 weeks

---

## 5. System Architecture

### 5.1 C4 Context Diagram

At the highest level, Career Genie exists within the following system context:

**System:** Career Genie Web Application (React SPA)

**People:**
- **Student / Registered User** — Uses Career Genie to get career guidance, build resumes, practice interviews, and plan learning paths
- **Guest Visitor** — Views the landing page; can register to become a user

**External Systems:**
- **Firebase Authentication (Google)** — Handles user identity; Career Genie sends credentials and receives JWT tokens
- **Groq API** — Receives structured LLM prompts from Career Genie; returns text completions (chat, roadmap, interview) and speech transcriptions (Whisper)
- **FastAPI ML Service** — Receives a career feature vector; returns top-5 career predictions with probabilities and confidence
- **Browser localStorage** — Stores all user-specific application data (resume, assessment, roadmap, interview sessions, chat history, predictions) client-side

Career Genie does not operate a traditional database server. All persistence is handled client-side (localStorage), with Firebase providing only authentication. The ML prediction service is the only custom server-side component.

### 5.2 C4 Container Diagram

Career Genie decomposes into four containers:

**Container 1: React SPA (Frontend)**
- Technology: React 18 + TypeScript + Vite
- Responsibilities: All user-facing UI, client-side routing, state management, API calls to Groq and ML service, localStorage read/write, Firebase Auth integration
- Communicates with: Firebase Auth (REST/SDK), Groq API (REST), FastAPI ML Service (REST), localStorage (browser API)

**Container 2: Firebase Authentication**
- Technology: Google Firebase Auth (SaaS)
- Responsibilities: User registration, email/password authentication, session tokens, profile storage (displayName)
- Communicates with: React SPA via Firebase JS SDK

**Container 3: Groq API**
- Technology: Groq Cloud (third-party LLM inference API)
- Responsibilities: LLM chat completions (Llama 3.3-70b), audio transcription (Whisper)
- Communicates with: React SPA via HTTPS REST + Groq JS SDK

**Container 4: FastAPI ML Service**
- Technology: Python 3.11, FastAPI, scikit-learn
- Responsibilities: Serve the trained Random Forest model; accept feature vectors; return career predictions with probabilities
- Communicates with: React SPA via HTTPS REST (JSON)

### 5.3 C4 Component Diagram (React SPA)

The React SPA decomposes into the following major components:

**Routing Layer:**
- `App.tsx` — Root React Router v6 provider; defines public and protected route trees

**Auth Layer:**
- `AuthContext.tsx` — Firebase onAuthStateChanged listener; exposes `user`, `login`, `register`, `logout` to all components via React Context
- `ProtectedRoute.tsx` — Redirects unauthenticated users to `/login`

**Layout Components:**
- `Navbar.tsx` — Public site navigation (landing, about, services, login/signup)
- `DashboardLayout.tsx` — Authenticated app shell with collapsible sidebar (8 nav items), user card, logout button

**Feature Pages:**
- `pages/Index.tsx` — Landing page
- `pages/dashboard/Home.tsx` — Dashboard with live stats
- `pages/dashboard/Chat.tsx` — AI career chat
- `pages/dashboard/Resume.tsx` — Resume builder orchestrator
- `pages/dashboard/ResumeForm.tsx` — Resume data entry form
- `pages/dashboard/Interview.tsx` — Mock interview simulator
- `pages/dashboard/Roadmap.tsx` — Career roadmap generator and tracker
- `pages/dashboard/Settings.tsx` — Profile and data management

**Shared UI Components:**
- `components/resume/ResumePreview.tsx` — HTML resume preview (6 templates)
- `components/resume/ResumePDF.tsx` — @react-pdf/renderer PDF templates (6 templates)

**Business Logic Libraries:**
- `lib/ai.ts` — Generic LLM helpers: `aiText()` and `aiJson()` wrappers
- `lib/groq.ts` — Groq SDK client initialization
- `lib/careerEngine.ts` — Assessment feature building, ML API call, local fallback, skill gap analysis
- `lib/roadmap.ts` — Roadmap generation, progress calculation, streak tracking
- `lib/interview.ts` — Question generation, answer evaluation, session management
- `lib/resume.ts` — Resume data types, ATS scoring, sample/empty resume factories
- `lib/userStore.ts` — localStorage read/write with user-scoped keys
- `lib/firebase.ts` — Firebase app initialization and auth export

**Custom Hooks:**
- `hooks/useVoiceRecorder.ts` — MediaRecorder + Groq Whisper transcription; exposes `recording`, `transcribing`, `toggle`, `start`, `stop`

### 5.4 Entity-Relationship Diagram

The following logical entities are managed within Career Genie's client-side data store:

**Entity: User** (stored in Firebase Auth; UID used as localStorage key prefix)
```
User {
  uid: string (Firebase UID — primary key)
  email: string
  displayName: string | null
  createdAt: timestamp
  emailVerified: boolean
}
```

**Entity: ResumeData** (localStorage key: `resume`)
```
ResumeData {
  personal: Personal {
    fullName, title, email, phone, location, website, summary
  }
  education: EducationItem[] {
    id, school, degree, start, end, detail
  }
  experience: ExperienceItem[] {
    id, company, role, start, end, bullets (newline-separated)
  }
  skills: string[]
  projects: ProjectItem[] {
    id, name, link, description
  }
}
```

**Entity: InterviewSession** (localStorage key: `interview_sessions`, array)
```
InterviewSession {
  id: string
  role: string
  difficulty: "entry" | "mid" | "senior"
  date: string (ISO)
  questions: string[]
  answers: Answer[] {
    question, answer, score (0-10), feedback, idealPoints: string[], timeUsed
  }
  overallScore: number (0-100)
  finished: boolean
}
```

**Entity: Roadmap** (localStorage key: `roadmap`)
```
Roadmap {
  goal: string
  currentSkills: string
  createdAt: string
  phases: RoadmapPhase[] {
    id, title, summary, weeks, tasks: RoadmapTask[] {
      id, text, done, resourceLabel, resourceUrl
    }
  }
  completionDates: string[]
  techStack: string[]
}
```

**Entity: Assessment** (localStorage key: `assessment`)
```
Assessment {
  personalityAnswers: Record<string, number> (question_id → 1-5 Likert)
  skillRatings: Record<string, number> (skill_id → 0-4)
  completedAt: string
}
```

**Entity: PredictionResult** (localStorage key: `prediction`)
```
PredictionResult {
  topCareer: string
  predictions: CareerPrediction[] {
    career: string
    probability: number
    description: string
  }
  confidence: number
  uncertain: boolean
  algorithm: string ("ML model" | "Offline scorer")
  timestamp: string
}
```

### 5.5 Data Dictionary

#### Table: Personal (within ResumeData)

| Field | Type | Description | Constraints |
|-------|------|-------------|------------|
| fullName | string | User's full name as it appears on the resume | Max 80 chars |
| title | string | Professional title / desired role | Max 80 chars |
| email | string | Contact email for the resume | Valid email format |
| phone | string | Contact phone number | Free text |
| location | string | City and country | Max 60 chars |
| website | string | Portfolio URL or GitHub link | Free text |
| summary | string | 2–4 sentence professional summary | Max 500 chars recommended |

#### Table: ExperienceItem

| Field | Type | Description | Constraints |
|-------|------|-------------|------------|
| id | string | Unique 8-char random ID | Generated by uid8() |
| company | string | Employer company name | Max 80 chars |
| role | string | Job title at this company | Max 80 chars |
| start | string | Start year or month-year | Free text |
| end | string | End year or "Present" | Free text |
| bullets | string | Newline-separated achievement bullets | Each line ≤ 150 chars recommended |

#### Table: InterviewSession.Answer

| Field | Type | Description | Constraints |
|-------|------|-------------|------------|
| question | string | The interview question text | Set by AI generator |
| answer | string | User's typed or transcribed answer | May be empty (auto-scored 0) |
| score | number | AI-assigned score | Integer 0–10 |
| feedback | string | 2–3 sentence AI feedback | Generated by evaluateAnswer() |
| idealPoints | string[] | Key points a strong answer would cover | 3–5 items |
| timeUsed | number | Seconds the user spent on this answer | ≤ 120 (SECONDS_PER_Q) |

#### Table: RoadmapPhase

| Field | Type | Description | Constraints |
|-------|------|-------------|------------|
| id | string | Unique phase identifier | uuid or sequential |
| title | string | Phase name (e.g., "Phase 1: Fundamentals") | Generated by LLM |
| summary | string | 1–2 sentence description of the phase | Generated by LLM |
| weeks | number | Estimated weeks to complete | 2–8 weeks per phase |
| tasks | RoadmapTask[] | List of learning tasks | 3–5 per phase |

#### Table: CareerPrediction

| Field | Type | Description | Constraints |
|-------|------|-------------|------------|
| career | string | Career title (e.g., "Software Engineer") | From predefined career list |
| probability | number | Predicted match probability | 0.0 – 1.0, all 5 sum to ~1.0 |
| description | string | Brief description of the career | Hardcoded per career |

---

## 6. Implementation Details

### 6.1 Development Environment Setup

**Prerequisites:**
- Node.js 18.x or higher
- npm 9.x or higher
- A Groq API key (free tier available at console.groq.com)
- Firebase project with Authentication enabled

**Installation:**
```bash
git clone https://github.com/careergeniee/career-genie.git
cd career-genie
npm install
```

**Environment Variables** (create `.env` file):
```
VITE_GROQ_API_KEY=your_groq_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_ML_API_URL=http://localhost:8000   # or deployed FastAPI URL
```

**Run development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

### 6.2 Module-by-Module Implementation

#### 6.2.1 Authentication Module
**Files:** `src/lib/firebase.ts`, `src/contexts/AuthContext.tsx`

Firebase is initialized once in `firebase.ts`, exporting `auth` and `db` instances. `AuthContext.tsx` wraps the entire app with a React Context that listens to `onAuthStateChanged`, exposing the current `user` object, `login()`, `register()`, and `logout()` functions. All dashboard pages consume this context via the `useAuth()` hook. The `ProtectedRoute` component wraps all dashboard routes and redirects unauthenticated users to `/login`.

#### 6.2.2 User Data Store
**File:** `src/lib/userStore.ts`

All application data is stored in `localStorage` using user-scoped keys in the format `cg:{uid}:{key}`. The `saveData<T>(key, value)` function serializes to JSON; `loadData<T>(key, defaultValue)` deserializes with a provided fallback. This single-file abstraction means every feature uses the same persistence interface and keys are automatically isolated per user.

#### 6.2.3 AI Integration
**Files:** `src/lib/groq.ts`, `src/lib/ai.ts`

`groq.ts` initializes the Groq JS SDK client with the API key from `import.meta.env.VITE_GROQ_API_KEY`. `ai.ts` provides two helpers:
- `aiText(system, user, opts?)` — Returns a plain text completion string
- `aiJson<T>(system, user, opts?)` — Returns a parsed JSON object of type T; strips markdown code fences before parsing

Both helpers use `llama-3.3-70b-versatile` as the default model with sensible defaults for `max_tokens` and `temperature`.

#### 6.2.4 Career Prediction Engine
**File:** `src/lib/careerEngine.ts`

The career engine's flow is: Assessment answers → `buildFeatures()` → feature vector → `predictCareers()` → predictions.

`buildFeatures()` computes personality trait scores by averaging the relevant Likert responses (using `traitScore()`) and appends normalized skill self-ratings, producing a float vector of 40+ dimensions.

`predictCareers()` first attempts the FastAPI ML endpoint (8-second timeout, 1 automatic retry on network failure). On failure, it falls back to the local scorer, which computes weighted cosine similarity between the user's feature vector and each career's "ideal" profile vector, then applies softmax normalization with temperature 0.12 to produce smooth probabilities.

#### 6.2.5 Resume Builder
**Files:** `src/lib/resume.ts`, `src/components/resume/ResumePreview.tsx`, `src/components/resume/ResumePDF.tsx`

`resume.ts` defines the `ResumeData` TypeScript interfaces, the `sampleResume()` factory for the first-open preview, `scoreResume()` for ATS evaluation, and the `TEMPLATES` array describing the six template options.

`ResumePreview.tsx` renders six HTML/CSS template variants using Tailwind classes. It receives the same `ResumeData` and `TemplateId` props as the PDF renderer, ensuring visual consistency between preview and download.

`ResumePDF.tsx` uses `@react-pdf/renderer`'s `StyleSheet`, `Document`, `Page`, `View`, and `Text` primitives to render the same six templates as PDF. Each template has its own `StyleSheet.create({})` object tuned for A4 dimensions (595.28pt × 841.89pt). Key constraints of react-pdf's layout engine include the absence of CSS gradients (simulated with solid color blocks), limited flexbox support, and no dynamic font loading (only Helvetica and Times-Roman families are used).

#### 6.2.6 Roadmap Generator
**File:** `src/lib/roadmap.ts`

`generateRoadmap(goal, currentSkills)` constructs a detailed system prompt instructing the LLM to act as a "senior career mentor" and return a specific JSON structure. The prompt includes:
- The user's career goal
- The curated tech stack for the goal (from `getStack()`) so the LLM ensures all key technologies are covered
- The user's current skills (so the LLM skips technologies the user already knows)
- Instructions to include real `https://` resource URLs (MDN, freeCodeCamp, Coursera, roadmap.sh, YouTube)

The response is parsed from JSON and stored in localStorage.

#### 6.2.7 Mock Interview Simulator
**File:** `src/lib/interview.ts`

`generateQuestions(role, difficulty)` sends a concise prompt to the LLM asking for exactly 10 questions suitable for the specified role and difficulty level, returned as a JSON array.

`evaluateAnswer(role, difficulty, question, answer)` sends the question, role context, and user answer to the LLM with an evaluator prompt. The LLM returns a structured JSON object with `score` (0–10), `feedback` (2–3 sentences), and `idealPoints` (array of key points). Empty answers are handled client-side without an API call, returning a score of 0.

#### 6.2.8 Voice Input
**File:** `src/hooks/useVoiceRecorder.ts`

The hook uses the browser's `MediaRecorder` API to capture microphone audio. On `stop()`, the recorded audio blob is sent to the Groq Whisper API (`whisper-large-v3-turbo` model) via a `FormData` POST request. The transcription text is returned via the `onTranscript` callback, which in the Chat page auto-sends the message, and in the Interview page populates the answer textarea.

The hook exposes `toggle()` for desktop click-to-toggle behavior and separate `start()` / `stop()` for mobile press-and-hold.

### 6.3 AI and ML Integration

#### LLM Prompting Strategy

All LLM interactions follow a structured pattern:
1. A **system prompt** establishes the LLM's role (e.g., "You are an expert resume writer", "You are a senior technical interviewer")
2. A **user prompt** provides the specific context and task
3. For structured outputs, the system prompt instructs the model to return ONLY valid JSON matching a specified schema
4. The `aiJson()` helper strips markdown fences (` ```json `) before `JSON.parse()` to handle formatting variations

#### Random Forest Model (FastAPI Backend)

The ML backend is a standalone Python FastAPI service. Key implementation details:
- **Training data:** A curated dataset mapping personality + skills profiles to career labels
- **Feature count:** 40+ dimensions (12 personality traits + 20+ skill ratings)
- **Model:** `sklearn.ensemble.RandomForestClassifier` (n_estimators=100, max_depth tuned per validation)
- **API endpoint:** `POST /predict` — accepts `{features: number[], top_k: number}`, returns `{predictions: [{career, probability}], confidence, algorithm}`
- **Timeout handling:** The React client sets an 8-second AbortController timeout; on timeout or network error, the local fallback activates automatically

#### Local Fallback Scorer

When the FastAPI ML service is unavailable, `predictCareers()` switches to a purely client-side similarity scorer:
1. Retrieve the user's feature vector
2. For each career in the predefined list, compute the dot product between the user vector and the career's "ideal" profile vector, weighted by feature importance
3. Apply softmax with temperature 0.12 to convert raw scores to probabilities
4. Return the top-K careers sorted by probability

This ensures the Career Prediction feature is fully functional offline or when the ML service is down.

### 6.4 Key Code Excerpts

#### Feature Vector Construction (careerEngine.ts)
```typescript
export function buildFeatures(assessment: Assessment): number[] {
  const traits = PERSONALITY_TRAITS.map(trait =>
    traitScore(trait, assessment.personalityAnswers)
  );
  const skills = SKILL_NAMES.map(skill =>
    (assessment.skillRatings[skill] ?? 0) / 4  // normalize 0-4 → 0-1
  );
  return [...traits, ...skills];
}

function traitScore(trait: string, answers: Record<string, number>): number {
  const relevant = PERSONALITY_QUESTIONS
    .filter(q => q.trait === trait)
    .map(q => (answers[q.id] ?? 3) / 5);  // normalize 1-5 → 0-1
  return relevant.length > 0
    ? relevant.reduce((a, b) => a + b, 0) / relevant.length
    : 0.5;
}
```

#### ATS Scoring (resume.ts)
```typescript
export async function scoreResume(
  resume: ResumeData,
  targetRole: string
): Promise<AtsResult> {
  const flat = `
Name: ${resume.personal.fullName}
Skills: ${resume.skills.join(", ")}
Experience:
${resume.experience.map(e => `- ${e.role} at ${e.company}: ${e.bullets}`).join("\n")}
  `.trim();

  const system = "You are an ATS and senior technical recruiter. " +
    "Evaluate resumes objectively against a target role and return a JSON object.";

  const res = await aiJson<AtsResult>(system, `Target role: "${targetRole}"\n\n${flat}`);
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(res.score) || 0))),
    summary: res.summary || "",
    strengths: Array.isArray(res.strengths) ? res.strengths : [],
    improvements: Array.isArray(res.improvements) ? res.improvements : [],
    missingKeywords: Array.isArray(res.missingKeywords) ? res.missingKeywords : [],
  };
}
```

#### Roadmap Generation System Prompt (roadmap.ts)
```typescript
const systemPrompt = `You are a senior career mentor. Generate a personalized learning roadmap as a JSON object.
The roadmap must have 4-6 phases. Each phase has: id, title, summary, weeks (integer), and tasks (3-5 items).
Each task has: id, text (what to do), resourceLabel (link title), resourceUrl (real https:// URL).
Use only real, free learning resources: MDN, freeCodeCamp, roadmap.sh, Coursera free tier, YouTube channels.
Return ONLY valid JSON. No markdown fences. No commentary.`;
```

---

## 7. Project Monitoring

### 7.1 Requirements Traceability Matrix

| Req ID | User Story (Summary) | Sprint | Implementation File(s) | Status |
|--------|---------------------|--------|----------------------|--------|
| US-001 | Register with email/password | Sprint 1 | AuthContext.tsx, firebase.ts | Done |
| US-002 | Login with email/password | Sprint 1 | AuthContext.tsx, Login.tsx | Done |
| US-003 | Logout | Sprint 1 | AuthContext.tsx, DashboardLayout.tsx | Done |
| US-004 | Update display name | Sprint 1 | Settings.tsx, Firebase Auth | Done |
| US-005 | View account metadata | Sprint 1 | Settings.tsx | Done |
| US-006 | Roadmap % on dashboard | Sprint 1 (wired Sprint 5) | Home.tsx, roadmap.ts | Done |
| US-007 | Interview sessions count | Sprint 1 (wired Sprint 5) | Home.tsx, interview.ts | Done |
| US-008 | Last interview score | Sprint 1 (wired Sprint 5) | Home.tsx, userStore.ts | Done |
| US-009 | Top career match on dashboard | Sprint 1 (wired Sprint 4) | Home.tsx, careerEngine.ts | Done |
| US-010 | Feature navigation grid | Sprint 1 | Home.tsx | Done |
| US-011 | AI career chat | Sprint 3 | Chat.tsx, groq.ts | Done |
| US-012 | Pakistani job market context | Sprint 3 | Chat.tsx (SYSTEM_PROMPT) | Done |
| US-013 | Chat history persistence | Sprint 3 | Chat.tsx, localStorage | Done |
| US-014 | Voice input for chat | Sprint 3 | useVoiceRecorder.ts, Groq Whisper | Done |
| US-015 | New chat session | Sprint 3 | Chat.tsx | Done |
| US-016 | Resume form (all sections) | Sprint 2 | ResumeForm.tsx, resume.ts | Done |
| US-017 | Live resume preview | Sprint 2 | Resume.tsx, ResumePreview.tsx | Done |
| US-018 | 6 resume templates | Sprint 2 | ResumePreview.tsx, ResumePDF.tsx | Done |
| US-019 | PDF download | Sprint 2 | Resume.tsx, ResumePDF.tsx | Done |
| US-020 | AI ATS scoring | Sprint 2 | Resume.tsx, resume.ts (scoreResume) | Done |
| US-021 | AI bullet rewriter | Sprint 2 | Resume.tsx (rewriteBullets) | Done |
| US-022 | Reset resume | Sprint 2 | Resume.tsx (resetResume) | Done |
| US-023 | Personality Likert questions | Sprint 3 | Assessment page, careerEngine.ts | Done |
| US-024 | Skill self-rating | Sprint 3 | Assessment page, careerEngine.ts | Done |
| US-025 | Assessment persistence | Sprint 3 | userStore.ts (assessment key) | Done |
| US-026 | Top 5 career predictions | Sprint 4 | careerEngine.ts (predictCareers) | Done |
| US-027 | Confidence score | Sprint 4 | careerEngine.ts | Done |
| US-028 | Algorithm attribution | Sprint 4 | careerEngine.ts (algorithm field) | Done |
| US-029 | Offline prediction fallback | Sprint 4 | careerEngine.ts (local scorer) | Done |
| US-030 | Skill gap report | Sprint 4 | careerEngine.ts (analyzeSkillGap) | Done |
| US-031 | Strong/Developing/Missing categories | Sprint 4 | careerEngine.ts | Done |
| US-032 | AI roadmap generation | Sprint 5 | roadmap.ts (generateRoadmap) | Done |
| US-033 | Roadmap phases with tasks | Sprint 5 | Roadmap.tsx, roadmap.ts | Done |
| US-034 | Task resource links | Sprint 5 | roadmap.ts (resourceUrl per task) | Done |
| US-035 | Task completion toggle | Sprint 5 | Roadmap.tsx | Done |
| US-036 | Roadmap progress % | Sprint 5 | roadmap.ts (totalProgress) | Done |
| US-037 | Daily streak | Sprint 5 | roadmap.ts (currentStreak) | Done |
| US-038 | Tech stack panel | Sprint 5 | roadmap.ts (getStack), Roadmap.tsx | Done |
| US-039 | Interview role/difficulty setup | Sprint 5 | Interview.tsx | Done |
| US-040 | AI question generation | Sprint 5 | interview.ts (generateQuestions) | Done |
| US-041 | 2-minute countdown timer | Sprint 5 | Interview.tsx (SECONDS_PER_Q=120) | Done |
| US-042 | Text + voice answer input | Sprint 5 | Interview.tsx, Web Speech API | Done |
| US-043 | AI answer scoring + feedback | Sprint 5 | interview.ts (evaluateAnswer) | Done |
| US-044 | Ideal answer points | Sprint 5 | interview.ts (idealPoints field) | Done |
| US-045 | Overall session score | Sprint 5 | Interview.tsx (score calculation) | Done |
| US-046 | Review/delete past sessions | Sprint 5 | Interview.tsx (sessions list) | Done |
| US-047 | Clear individual data categories | Sprint 6 | Settings.tsx (clearKey) | Done |
| US-048 | Clear all data | Sprint 6 | Settings.tsx (clearAll) | Done |

**Coverage Summary:** 48/48 user stories implemented (100% for MVP scope)

---

## 8. Results and Output

### 8.1 Feature Completion Summary

| Feature Module | Status | Key Metrics |
|---------------|--------|-------------|
| Firebase Authentication | Complete | Email/password register, login, logout, profile update |
| Landing Page | Complete | Hero, 7 feature cards, highlights, responsive |
| Dashboard Home | Complete | 4 live stats, 8 feature navigation cards |
| AI Career Chat | Complete | Llama 3.3-70b, voice input, 100-message history |
| Resume Builder | Complete | 6 templates, live preview, PDF, ATS score, bullet rewriter |
| Career Assessment | Complete | 12+ personality questions, 20+ skill ratings |
| Career Path Prediction | Complete | Top-5 careers, confidence, RF model + offline fallback |
| Skill Gap Analysis | Complete | 3-tier categorization (Strong/Developing/Missing) |
| Career Roadmap | Complete | AI phases, task tracking, streak, tech stacks |
| Mock Interview Simulator | Complete | 10 AI questions, voice input, timer, scoring, history |
| Settings | Complete | Profile edit, 9 data category clears |

### 8.2 Performance Observations

| Metric | Observed Value | Notes |
|--------|---------------|-------|
| First Contentful Paint | < 1.5s | Vite + Tailwind optimized build |
| Groq LLM response latency | 1–3 seconds | Groq's fast inference; depends on response length |
| Groq Whisper transcription | < 2 seconds | For typical 10–30 second voice clips |
| FastAPI ML prediction | < 500ms | When ML backend is available |
| Local fallback prediction | < 50ms | Pure client-side computation |
| PDF generation | 2–4 seconds | @react-pdf/renderer rendering time |
| Resume autosave debounce | 400ms | Prevents excessive localStorage writes |
| Production bundle size | < 500KB gzipped | Vite tree-shaking + code splitting |

### 8.3 Sample Outputs

**Sample ATS Score Output:**
```json
{
  "score": 74,
  "summary": "Strong React and TypeScript experience well-aligned with the role. 
               Missing backend and system design keywords expected for senior positions.",
  "strengths": [
    "Quantified achievements (40% performance improvement)",
    "Strong frontend stack match (React, TypeScript, Tailwind)",
    "Relevant project experience with Career Genie"
  ],
  "improvements": [
    "Add Node.js and API design experience",
    "Include testing frameworks (Jest, Cypress)",
    "Add soft skills section (leadership, communication)"
  ],
  "missingKeywords": ["REST API", "Node.js", "Jest", "Agile", "CI/CD"]
}
```

**Sample Career Prediction Output:**
```json
{
  "topCareer": "Frontend Developer",
  "predictions": [
    { "career": "Frontend Developer", "probability": 0.42 },
    { "career": "UI/UX Designer", "probability": 0.21 },
    { "career": "Full Stack Developer", "probability": 0.18 },
    { "career": "Product Manager", "probability": 0.11 },
    { "career": "Mobile Developer", "probability": 0.08 }
  ],
  "confidence": 0.68,
  "uncertain": false,
  "algorithm": "ML model"
}
```

**Sample Interview Evaluation Output:**
```json
{
  "score": 7,
  "feedback": "Good explanation of React reconciliation with a clear example. 
               Consider mentioning the virtual DOM diffing algorithm more explicitly. 
               Time management was excellent.",
  "idealPoints": [
    "Virtual DOM and diffing algorithm",
    "Key prop importance for list performance",
    "Fiber architecture for async rendering",
    "Practical implications for shouldComponentUpdate / React.memo"
  ]
}
```

---

## 9. Conclusion

Career Genie set out to democratize career guidance for Pakistani students and early-career professionals by combining the power of large language models, classical machine learning, and a thoughtfully designed web interface into a single, free, accessible platform.

Over twelve weeks of development, the team successfully delivered all ten planned modules: an AI career chat mentor, a six-template resume builder with ATS scoring and PDF export, a career assessment instrument, an ML-based career path prediction engine with an offline fallback, a skill gap analysis tool, an AI-generated career roadmap with gamified progress tracking, and a voice-enabled mock interview simulator. The platform achieved 100% coverage of its 48 user stories.

The most technically challenging aspects of the project were the dual-mode career prediction system (requiring both a FastAPI Random Forest service and a client-side cosine-similarity fallback), the @react-pdf/renderer template system (which required careful layout tuning within its subset of CSS), and the voice pipeline (combining MediaRecorder, Groq Whisper, and the Web Speech API in a cross-browser-compatible hook).

Career Genie proves that a small, focused team can build a production-quality AI application using modern open-source tools and third-party APIs within a university project timeline. More importantly, it demonstrates that AI can meaningfully address a real social problem — the career guidance gap facing Pakistan's young population — at negligible marginal cost per user.

---

## 10. Future Work

The following enhancements are planned for post-submission development:

1. **Firestore Data Migration:** Replace localStorage with Firestore cloud storage so user data persists across devices and browsers. The architecture is already prepared — `userStore.ts` needs only a dual-write wrapper.

2. **Native Mobile Application:** A React Native version of Career Genie to serve the majority of Pakistani students who primarily use smartphones rather than computers.

3. **Job Board Integration:** Direct integration with Rozee.pk, LinkedIn, and Mustakbil APIs to surface relevant job listings based on the user's career prediction and skill profile.

4. **Real-Time Recruiter Matching:** Connect students with verified career counselors and hiring managers for paid 1:1 sessions, creating a marketplace layer on top of the free AI tools.

5. **Urdu Language Support:** Adding Urdu as a second interface language to remove language barriers for students in smaller cities and rural areas.

6. **LinkedIn Profile Optimizer:** An AI tool that analyzes the user's LinkedIn profile and suggests keyword improvements, headline rewrites, and about section enhancements.

7. **Community Features:** Peer-to-peer mock interview matching (two users practice with each other), shared roadmaps, and a question bank contributed by the community.

8. **Advanced ML Model:** Retrain the career prediction model on a larger, Pakistan-specific dataset and experiment with neural network architectures for improved accuracy.

9. **Analytics Dashboard:** Aggregate (anonymized) platform usage statistics to help universities understand their students' career interests and skill gaps at scale.

10. **Premium Tier:** A freemium model offering unlimited AI requests, priority Groq access, and advanced features (cover letter generator, salary negotiation coach) for a monthly subscription.

---

## 11. Bibliography

1. Pakistan Bureau of Statistics. (2023). *Pakistan Social and Living Standards Measurement Survey 2019-20*. Government of Pakistan.

2. Jobscan. (2019). *Jobscan ATS Statistics: How Applicant Tracking Systems Are Eliminating Candidates*. Jobscan Inc.

3. Touvron, H., et al. (2023). *Llama 2: Open Foundation and Fine-Tuned Chat Models*. arXiv:2307.09288. Meta AI.

4. Meta AI. (2024). *Llama 3.3: A State-of-the-Art Language Model*. Meta Platforms Inc.

5. Breiman, L. (2001). *Random Forests*. Machine Learning, 45(1), 5–32. Kluwer Academic Publishers.

6. Google. (2024). *Firebase Authentication Documentation*. Firebase by Google. https://firebase.google.com/docs/auth

7. Groq Inc. (2024). *Groq API Documentation*. Groq. https://console.groq.com/docs

8. Facebook Open Source. (2024). *@react-pdf/renderer Documentation*. GitHub. https://react-pdf.org

9. Meta Open Source. (2024). *React 18 Documentation*. React. https://react.dev

10. Microsoft. (2024). *TypeScript 5.x Documentation*. TypeScript. https://www.typescriptlang.org/docs

11. Tailwind Labs. (2024). *Tailwind CSS Documentation*. Tailwind CSS. https://tailwindcss.com/docs

12. shadcn. (2024). *shadcn/ui Component Library*. GitHub. https://ui.shadcn.com

13. Vitejs. (2024). *Vite Documentation*. Vite. https://vitejs.dev

14. Brown, T., et al. (2020). *Language Models are Few-Shot Learners*. Advances in Neural Information Processing Systems, 33. OpenAI.

15. Vaswani, A., et al. (2017). *Attention Is All You Need*. Advances in Neural Information Processing Systems, 30. Google Brain.

16. Scikit-learn developers. (2024). *scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830.

17. Tiangolo, S. (2024). *FastAPI Documentation*. FastAPI. https://fastapi.tiangolo.com

---

## 12. Appendix

### 12.1 Glossary

| Term | Definition |
|------|-----------|
| **ATS** | Applicant Tracking System — software used by employers to scan, filter, and rank resumes based on keyword matching and formatting criteria before human review |
| **LLM** | Large Language Model — a deep learning model trained on massive text corpora to understand and generate natural language (e.g., Llama 3.3, GPT-4) |
| **Groq** | A hardware and software company providing ultra-low-latency LLM inference via their Language Processing Unit (LPU) architecture and cloud API |
| **Llama 3.3-70b** | A 70-billion-parameter open-weight language model released by Meta; used in Career Genie for chat, roadmap generation, and interview evaluation |
| **Whisper** | An automatic speech recognition (ASR) model developed by OpenAI, available via the Groq API for audio transcription |
| **React** | A JavaScript library for building user interfaces using reusable components; developed and maintained by Meta |
| **TypeScript** | A strongly typed superset of JavaScript that compiles to plain JavaScript; improves code quality and IDE support |
| **Vite** | A modern frontend build tool that provides a fast development server with Hot Module Replacement (HMR) and optimized production builds |
| **Tailwind CSS** | A utility-first CSS framework that applies design through composable class names directly in HTML/JSX |
| **shadcn/ui** | A collection of accessible, composable UI components built on Radix UI primitives and styled with Tailwind CSS |
| **Firebase** | Google's Backend-as-a-Service platform providing authentication, Firestore database, hosting, and other cloud services |
| **Firestore** | Firebase's NoSQL cloud database that stores data as JSON-like documents in collections |
| **localStorage** | A browser Web Storage API that allows web applications to store key-value pairs persistently in the user's browser |
| **FastAPI** | A modern, high-performance Python web framework for building REST APIs; used for the Career Genie ML prediction backend |
| **Random Forest** | An ensemble machine learning method that constructs multiple decision trees during training and outputs the mode of their predictions |
| **Cosine Similarity** | A metric that measures the cosine of the angle between two vectors; used in Career Genie's local career prediction fallback |
| **Softmax** | A mathematical function that converts a vector of real numbers into a probability distribution; used in the career prediction fallback to produce probability scores |
| **Feature Vector** | A numerical representation of an observation used as input to a machine learning model; in Career Genie, a 40+ dimensional vector encoding personality traits and skill levels |
| **SPA** | Single Page Application — a web app that loads a single HTML page and dynamically updates content without full page reloads |
| **JWT** | JSON Web Token — a compact, URL-safe means of representing claims between two parties; used by Firebase Auth for session management |
| **MediaRecorder API** | A browser Web API for recording audio and video from media streams; used in Career Genie's voice input feature |
| **Web Speech API** | A browser API providing speech recognition and synthesis capabilities; used as a fallback voice input mechanism in the Interview Simulator |
| **@react-pdf/renderer** | A React library for generating PDF documents using a subset of React's component model and a custom CSS-like styling system |
| **Streak** | In Career Genie's Roadmap feature, a count of consecutive days on which the user completed at least one roadmap task; used for gamification |
| **Story Points** | A unit used in Agile software development to estimate the relative effort or complexity of a user story; Career Genie uses the Fibonacci sequence (1, 2, 3, 5, 8) |
| **Sprint** | A time-boxed iteration in Agile development during which a set of user stories is planned, developed, and delivered; Career Genie used 2-week sprints |
| **Traceability Matrix** | A document that maps requirements to their implementation, ensuring all requirements are addressed and traceable to specific code artifacts |

### 12.2 API References

#### Groq API — Chat Completions
- **Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`
- **Model used:** `llama-3.3-70b-versatile`
- **Max tokens:** 1024–2048 depending on feature
- **Temperature:** 0.3 (structured outputs) – 0.7 (creative chat)
- **SDK:** `groq` npm package

#### Groq API — Audio Transcription (Whisper)
- **Endpoint:** `POST https://api.groq.com/openai/v1/audio/transcriptions`
- **Model used:** `whisper-large-v3-turbo`
- **Input format:** FormData with audio blob (webm/mp4/wav)
- **Output:** `{ text: string }`

#### Firebase Authentication REST API
- **SDK:** `firebase/auth` (Firebase JS SDK v9+)
- **Functions used:** `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`, `updateProfile`

#### FastAPI ML Prediction Service
- **Endpoint:** `POST {VITE_ML_API_URL}/predict`
- **Request body:** `{ features: number[], top_k: number }`
- **Response:** `{ predictions: [{career: string, probability: number}], confidence: number, uncertain: boolean, algorithm: string }`
- **Timeout:** 8 seconds (AbortController)
- **Retry:** 1 automatic retry on network failure

---

*Document prepared by the Career Genie FYP Team*  
*Department of Software Engineering, School of Systems and Technology*  
*University of Management and Technology, Lahore — 2026*

*GitHub Repository: https://github.com/careergeniee/career-genie*  
*Contact: careergeniefyp@gmail.com*
