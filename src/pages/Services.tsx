import { Link } from "react-router-dom";
import { Bot, FileText, MessageSquare, Map, GraduationCap, Brain, ArrowRight, Sparkles, Check } from "lucide-react";
import { GlowOrbs } from "@/components/GlowOrbs";
import { Button } from "@/components/ui/button";

const services = [
  {
    emoji: "🤖",
    icon: Bot,
    name: "AI Powered Chatbot",
    path: "/services/ai-chatbot",
    stat: "24/7 Available",
    category: "Discover",
    desc: "Your always-on career mentor. Ask about career paths, the Pakistani job market, skills to learn, or what to do next — and get instant, expert-level responses.",
    bullets: ["Powered by Llama 3.3 via Groq", "Pakistan job market insights", "Career path discovery", "24/7 instant guidance"],
  },
  {
    emoji: "📄",
    icon: FileText,
    name: "Resume Builder",
    path: "/services/resume-builder",
    stat: "ATS-Friendly",
    category: "Build",
    desc: "Build professional, ATS-optimized resumes with a live editor. Use AI to rewrite your bullet points to be achievement-focused and stand out to recruiters.",
    bullets: ["Live preview editor", "AI bullet point rewriter", "ATS score checker", "PDF export"],
  },
  {
    emoji: "🎤",
    icon: MessageSquare,
    name: "Interview Preparation",
    path: "/services/interview-prep",
    stat: "AI Feedback",
    category: "Build",
    desc: "Practice with AI-generated interview questions for your target role. Answer by typing or use voice input, and receive detailed feedback on your performance.",
    bullets: ["Role-specific questions", "Voice input support", "AI feedback & scoring", "Unlimited practice sessions"],
  },
  {
    emoji: "🗺️",
    icon: Map,
    name: "Career Roadmap",
    path: "/services/roadmap",
    stat: "Step-by-Step",
    category: "Grow",
    desc: "Get a personalized, step-by-step learning roadmap for your chosen career path — built by AI based on your goals, skills, and timeline.",
    bullets: ["Personalized to your goals", "Milestone tracking", "Resource recommendations", "Adjustable timelines"],
  },
  {
    emoji: "🎓",
    icon: GraduationCap,
    name: "AI Instructor",
    path: "/services/instructor",
    stat: "Learn Anything",
    category: "Grow",
    desc: "Learn career-relevant topics through an AI instructor that explains concepts clearly, answers follow-up questions, and adapts to your pace.",
    bullets: ["Interactive lessons", "Follow-up Q&A", "Topic explanations", "Career-relevant content"],
  },
  {
    emoji: "🧠",
    icon: Brain,
    name: "Career Assessment",
    path: "/services/assessment",
    stat: "Find Your Path",
    category: "Discover",
    desc: "Take a structured assessment to discover which career paths best match your skills, interests, and strengths — powered by AI prediction.",
    bullets: ["20-question assessment", "AI career prediction", "Strength analysis", "Instant results"],
  },
];

const categoryColors: Record<string, string> = {
  Discover: "bg-blue-50 text-blue-600 border-blue-100",
  Build: "bg-primary/10 text-primary border-primary/20",
  Grow: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const Services = () => {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative py-24 lg:py-36 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">All services — 100% free</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            A complete{" "}
            <span className="text-gradient-gold">career toolkit</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Six powerful AI tools, one unified platform — engineered to take you from where you are to where you want to be.
          </p>
        </div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="border-y border-border bg-secondary/20">
        <div className="container py-0">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { value: "6", label: "AI-Powered Tools" },
              { value: "0₨", label: "Cost Forever" },
              { value: "∞", label: "Usage Limit" },
            ].map((s) => (
              <div key={s.label} className="text-center py-6 px-4">
                <div className="font-display text-3xl font-bold text-gradient-gold mb-0.5">{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="container py-20">
        <div className="space-y-4">
          {services.map((s, i) => (
            <div
              key={s.path}
              className="rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
            >
              <div className="grid lg:grid-cols-[auto_1fr_auto] gap-0">
                {/* Index number */}
                <div className="hidden lg:flex items-center justify-center w-20 border-r border-border bg-secondary/20 shrink-0">
                  <span className="font-display text-3xl font-bold text-gradient-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border border-border bg-secondary flex items-center justify-center text-2xl shrink-0 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{s.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryColors[s.category]}`}>{s.category}</span>
                        <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">{s.stat}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-3 h-3 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                              <Check className="w-1.5 h-1.5 text-primary" />
                            </div>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-7 pb-7 lg:px-8 lg:pb-0 lg:flex lg:items-center lg:border-l lg:border-border shrink-0">
                  <Button asChild variant={i === 0 ? "hero" : "outline"} size="sm">
                    <Link to={s.path}>
                      Try it <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container pb-28">
        <div className="relative rounded-3xl overflow-hidden bg-foreground text-background px-10 md:px-16 py-16 text-center">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/30 blur-[100px] rounded-full" />
          <div className="relative max-w-xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-background">
              Try all tools{" "}
              <span className="text-primary">for free</span>
            </h2>
            <p className="text-background/70 mb-8 text-sm leading-relaxed">
              Create your free account and get instant access to every Career Genie tool — no credit card required.
            </p>
            <Button asChild size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
