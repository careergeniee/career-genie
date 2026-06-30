/**
 * careerCatalog.ts
 * ================
 * Career catalogue mirrored from career_data.py CAREERS.
 * Only features that matter for a role are listed; the rest are BASELINE.
 * Used by: (1) the offline fallback scorer, (2) skill-gap analysis.
 *
 * Career profiles sourced from O*NET occupational database (onetonline.org).
 * Personality values = O*NET Work Styles (standardised 0-100 → 0-1).
 * Technical values = O*NET Technology Skills + Knowledge ratings.
 */

import { BASELINE, FEATURE_ORDER, type FeatureKey } from "@/lib/mlSchema";

export const CAREERS: Record<string, Partial<Record<FeatureKey, number>>> = {
    // 15-2051.00 — Data Scientists
    "Data Scientist": {
        analytical: 0.94, problem_solving: 0.88, creativity: 0.88,
        communication: 0.76, teamwork: 0.79,
        python: 0.90, statistics: 0.92, machine_learning: 0.88,
        sql: 0.76, data_visualization: 0.80,
        databases: 0.58, cloud: 0.52, linux_devops: 0.50,
    },
    // 15-2051.00 / 15-1299.09 — Machine Learning Engineers
    "Machine Learning Engineer": {
        analytical: 0.92, problem_solving: 0.90, creativity: 0.82, teamwork: 0.75,
        python: 0.94, machine_learning: 0.94, statistics: 0.82,
        backend_apis: 0.70, cloud: 0.68, linux_devops: 0.65, databases: 0.55,
    },
    // 15-2041.00 / 15-1211.00 — Data Analysts
    "Data Analyst": {
        analytical: 0.90, communication: 0.82, problem_solving: 0.72,
        creativity: 0.65, teamwork: 0.72,
        sql: 0.92, data_visualization: 0.92, statistics: 0.80,
        python: 0.65, databases: 0.68,
    },
    // 15-1254.00 — Web Developers (Frontend)
    "Frontend Developer": {
        creativity: 0.84, analytical: 0.72, problem_solving: 0.70,
        communication: 0.66, teamwork: 0.75,
        javascript: 0.92, html_css: 0.94, react: 0.88, ui_ux_design: 0.72,
    },
    // 15-1252.00 — Software Developers (Backend)
    "Backend Developer": {
        analytical: 0.82, problem_solving: 0.86, creativity: 0.72, teamwork: 0.70,
        backend_apis: 0.92, databases: 0.88, sql: 0.80,
        python: 0.72, javascript: 0.58, linux_devops: 0.62, cloud: 0.58,
    },
    // 15-1254.00 + 15-1252.00 composite — Full Stack Developers
    "Full Stack Developer": {
        analytical: 0.75, problem_solving: 0.80, creativity: 0.76,
        communication: 0.68, teamwork: 0.74,
        javascript: 0.88, html_css: 0.82, react: 0.84,
        backend_apis: 0.84, databases: 0.78, sql: 0.70, cloud: 0.55,
    },
    // 15-1212.00 — Information Security Analysts
    "Cybersecurity Analyst": {
        analytical: 0.90, problem_solving: 0.88, creativity: 0.75,
        communication: 0.72, leadership: 0.64,
        networking_security: 0.94, linux_devops: 0.78,
        python: 0.62, cloud: 0.60, databases: 0.52,
    },
    // 15-1244.00 / 15-1299.08 — Cloud & DevOps Engineers
    "Cloud / DevOps Engineer": {
        analytical: 0.78, problem_solving: 0.82, creativity: 0.70, teamwork: 0.72,
        cloud: 0.94, linux_devops: 0.94, networking_security: 0.72,
        backend_apis: 0.65, databases: 0.58, python: 0.60,
    },
    // 15-1252.00 specialised — Mobile App Developers
    "Mobile App Developer": {
        creativity: 0.78, problem_solving: 0.75, analytical: 0.70, teamwork: 0.68,
        mobile_dev: 0.96, javascript: 0.70, react: 0.62,
        ui_ux_design: 0.65, backend_apis: 0.58,
    },
    // 15-1255.00 — Web & Digital Interface Designers (UI/UX)
    "UI/UX Designer": {
        creativity: 0.92, communication: 0.84, teamwork: 0.84,
        problem_solving: 0.65, analytical: 0.60,
        ui_ux_design: 0.96, html_css: 0.68, javascript: 0.52,
    },
};

export const CAREER_LABELS = Object.keys(CAREERS);

/** Short blurb per career for result cards. */
export const CAREER_BLURB: Record<string, string> = {
    "Data Scientist": "Turn data into insight with statistics, ML, and storytelling.",
    "Machine Learning Engineer": "Build and ship ML systems that learn from data at scale.",
    "Data Analyst": "Find patterns in data and communicate them with clear visuals.",
    "Frontend Developer": "Craft fast, polished user interfaces for the web.",
    "Backend Developer": "Design the servers, APIs, and databases behind the app.",
    "Full Stack Developer": "Own features end to end, from UI to database.",
    "Cybersecurity Analyst": "Defend systems and data from attacks and breaches.",
    "Cloud / DevOps Engineer": "Automate infrastructure and keep deployments reliable.",
    "Mobile App Developer": "Build native and cross-platform mobile experiences.",
    "UI/UX Designer": "Design intuitive, beautiful product experiences.",
};

/** Expand a sparse career profile into the full ordered vector. */
export function idealVector(career: string): number[] {
    const profile = CAREERS[career] || {};
    return FEATURE_ORDER.map((f) => profile[f] ?? BASELINE);
}
