/**
 * careerStacks.ts
 * ===============
 * The curated, end-to-end technology stack for each career field.
 *
 * Instead of a generic "learn these languages" list, each role maps to the
 * exact technologies that field needs — grouped from fundamentals through
 * frontend, backend, data, tooling, and deployment. The roadmap shows this
 * stack to the user and feeds it to the AI so the generated plan covers
 * precisely these technologies (A-to-Z for that field) and nothing unrelated.
 */

export interface StackGroup {
    category: string;
    items: string[];
}

/** Canonical career -> ordered technology groups (fundamentals first). */
export const CAREER_STACKS: Record<string, StackGroup[]> = {
    "Full Stack Developer": [
        { category: "Foundations", items: ["Git & GitHub", "How the Web works (HTTP)", "Data Structures & Algorithms"] },
        { category: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind CSS", "State management (Redux/Zustand)"] },
        { category: "Backend", items: ["Node.js", "Express", "REST APIs", "Authentication (JWT/OAuth)", "GraphQL (optional)"] },
        { category: "Databases", items: ["SQL (PostgreSQL)", "MongoDB", "ORMs (Prisma)"] },
        { category: "Deployment & Tools", items: ["Docker", "CI/CD", "Vercel / Netlify", "Basic AWS"] },
        { category: "Quality", items: ["Jest & React Testing Library", "Debugging"] },
    ],
    "Frontend Developer": [
        { category: "Foundations", items: ["Git & GitHub", "HTTP basics", "Web accessibility (a11y)"] },
        { category: "Languages & Markup", items: ["HTML", "CSS", "JavaScript", "TypeScript"] },
        { category: "Frameworks", items: ["React", "Next.js", "Vue (optional)"] },
        { category: "Styling", items: ["Tailwind CSS", "Sass", "Responsive design"] },
        { category: "Data & State", items: ["Redux / Zustand", "React Query", "Consuming REST / GraphQL APIs"] },
        { category: "Tooling & Testing", items: ["Vite / Webpack", "ESLint & Prettier", "Jest", "Cypress"] },
    ],
    "Backend Developer": [
        { category: "Foundations", items: ["Git & GitHub", "Data Structures & Algorithms", "Networking basics", "Linux basics"] },
        { category: "Language & Framework", items: ["Node.js + Express", "Python + FastAPI / Django (alternative)"] },
        { category: "APIs", items: ["REST APIs", "GraphQL", "Authentication & Authorization (JWT/OAuth)"] },
        { category: "Databases", items: ["SQL (PostgreSQL/MySQL)", "MongoDB", "Redis (caching)", "ORMs"] },
        { category: "Architecture", items: ["Caching", "Message queues", "Microservices basics"] },
        { category: "Deployment & Security", items: ["Docker", "CI/CD", "Nginx", "AWS basics", "OWASP security basics", "Testing"] },
    ],
    "Data Scientist": [
        { category: "Programming", items: ["Python", "Jupyter Notebooks", "Git"] },
        { category: "Math & Statistics", items: ["Statistics", "Probability", "Linear Algebra"] },
        { category: "Data Wrangling", items: ["NumPy", "Pandas", "SQL", "Data cleaning"] },
        { category: "Visualization", items: ["Matplotlib", "Seaborn", "Plotly"] },
        { category: "Machine Learning", items: ["Scikit-learn", "Supervised & unsupervised learning", "Model evaluation"] },
        { category: "Going Further", items: ["TensorFlow / PyTorch (intro)", "Model deployment basics"] },
    ],
    "Machine Learning Engineer": [
        { category: "Programming", items: ["Python", "Git", "Software engineering practices"] },
        { category: "Math", items: ["Linear Algebra", "Calculus", "Statistics"] },
        { category: "Core ML", items: ["Scikit-learn", "Feature engineering", "Model evaluation"] },
        { category: "Deep Learning", items: ["PyTorch / TensorFlow", "Neural networks", "CNNs / RNNs / Transformers"] },
        { category: "Data & Scale", items: ["SQL", "Data pipelines", "Spark (big data)"] },
        { category: "MLOps", items: ["Model serving (FastAPI)", "Docker", "MLflow", "CI/CD", "AWS / GCP ML services"] },
    ],
    "Data Analyst": [
        { category: "Spreadsheets", items: ["Excel (advanced)", "Google Sheets"] },
        { category: "Querying", items: ["SQL", "Joins", "Window functions"] },
        { category: "Programming", items: ["Python (Pandas)", "R (alternative)"] },
        { category: "Visualization", items: ["Power BI", "Tableau", "Matplotlib / Seaborn"] },
        { category: "Statistics", items: ["Descriptive statistics", "Hypothesis testing"] },
        { category: "Communication", items: ["Dashboards", "Reporting & data storytelling"] },
    ],
    "DevOps / Cloud Engineer": [
        { category: "OS & Scripting", items: ["Linux", "Bash", "Python scripting"] },
        { category: "Version Control", items: ["Git & GitHub"] },
        { category: "Containers", items: ["Docker", "Kubernetes"] },
        { category: "CI/CD", items: ["GitHub Actions", "Jenkins", "GitLab CI"] },
        { category: "Infrastructure as Code", items: ["Terraform", "Ansible"] },
        { category: "Cloud", items: ["AWS (EC2, S3, IAM)", "Azure / GCP (alternative)"] },
        { category: "Observability & Security", items: ["Prometheus & Grafana", "Logging", "Networking & security basics"] },
    ],
    "Mobile App Developer": [
        { category: "Foundations", items: ["Git & GitHub", "Programming fundamentals", "OOP"] },
        { category: "Cross-platform", items: ["React Native", "Flutter / Dart (alternative)"] },
        { category: "Native (optional)", items: ["Kotlin (Android)", "Swift (iOS)"] },
        { category: "UI & State", items: ["Mobile UI/UX patterns", "Responsive layouts", "State management", "Local storage"] },
        { category: "Backend Integration", items: ["REST APIs", "Firebase", "Push notifications"] },
        { category: "Shipping", items: ["Testing", "Play Store / App Store deployment"] },
    ],
    "Cybersecurity Analyst": [
        { category: "Foundations", items: ["Networking (TCP/IP)", "Linux", "Operating system internals"] },
        { category: "Scripting", items: ["Python", "Bash"] },
        { category: "Security Core", items: ["OWASP Top 10", "Cryptography basics", "Wireshark", "Nmap", "Burp Suite"] },
        { category: "Defense", items: ["SIEM", "Intrusion detection", "Incident response"] },
        { category: "Offensive Basics", items: ["Penetration testing fundamentals", "Kali Linux"] },
        { category: "Governance", items: ["Security frameworks", "Risk & compliance", "Security+ / CEH (awareness)"] },
    ],
    "UI/UX Designer": [
        { category: "Design Fundamentals", items: ["Color theory", "Typography", "Layout & visual hierarchy"] },
        { category: "UX Process", items: ["User research", "Personas", "User flows", "Wireframing"] },
        { category: "Tools", items: ["Figma", "Adobe XD", "Prototyping"] },
        { category: "Interaction & Systems", items: ["Interaction design", "Design systems", "Accessibility"] },
        { category: "Validation", items: ["Usability testing"] },
        { category: "Developer Handoff", items: ["Basic HTML/CSS awareness", "Design-to-dev handoff"] },
    ],
};

/** Map alternative role labels (e.g. from Career Match) to a canonical key. */
const ALIASES: Record<string, string> = {
    "DevOps Engineer": "DevOps / Cloud Engineer",
    "Cloud Engineer": "DevOps / Cloud Engineer",
    "Cloud / DevOps Engineer": "DevOps / Cloud Engineer",
    "Software Developer": "Full Stack Developer",
    "Software Engineer": "Full Stack Developer",
};

/** Return the curated stack for a goal, or null for unknown/custom goals. */
export function getStack(goal: string): StackGroup[] | null {
    const key = CAREER_STACKS[goal] ? goal : ALIASES[goal];
    return key && CAREER_STACKS[key] ? CAREER_STACKS[key] : null;
}

/** Flatten a stack to a plain list of technology names. */
export function flattenStack(stack: StackGroup[]): string[] {
    return stack.flatMap((g) => g.items);
}

/** Format a stack for the AI prompt, grouped by category. */
export function stackToPromptText(stack: StackGroup[]): string {
    return stack.map((g) => `${g.category}: ${g.items.join(", ")}`).join("\n");
}

/** Heuristic: is this technology already known, given the user's skills text? */
export function isKnown(tech: string, skillsText: string): boolean {
    if (!skillsText) return false;
    const hay = skillsText.toLowerCase();
    const lower = tech.toLowerCase();

    // A stack item may bundle several technologies ("Node.js + Express",
    // "Python/FastAPI"), and/or list alternatives inside parens ("State
    // management (Redux/Zustand)"). Only a parenthetical that itself contains
    // a separator is treated as an alternatives list to extract — a
    // single-word parenthetical ("(alternative)", "(advanced)", "(optional)")
    // is a qualifier, not a technology name, and extracting it would make
    // generic words falsely "known" whenever they happen to appear anywhere
    // in the user's skills text.
    const parenGroups = [...lower.matchAll(/\(([^)]*)\)/g)].map((m) => m[1]);
    const extractedFromParens = parenGroups
        .filter((g) => /[/&,+]/.test(g))
        .flatMap((g) => g.split(/[/&,+]/));

    const withoutParens = lower.replace(/\(.*?\)/g, "");
    const outerCores = withoutParens.split(/[/&,+]/);

    // Split on separators including '+' and check each core token
    // independently — knowing any one of them counts as known. A minimum
    // length of 1 (not 2) so single-letter language names like "R" are still
    // matchable; the word-boundary regex below already prevents a lone
    // letter from matching inside an unrelated word.
    const cores = [...outerCores, ...extractedFromParens]
        .map((s) => s.trim())
        .filter((s) => s.length >= 1);

    return cores.some((core) => {
        const esc = core.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Word-boundary match so "java" doesn't match inside "javascript".
        return new RegExp(`(^|[^a-z])${esc}([^a-z]|$)`, "i").test(hay);
    });
}
