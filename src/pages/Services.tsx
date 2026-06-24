import { Link } from "react-router-dom";
import { Bot, FileText, MessageSquare, Map, GraduationCap, Brain, ArrowRight, Sparkles } from "lucide-react";
import { GlowOrbs } from "@/components/GlowOrbs";
import { Button } from "@/components/ui/button";

const services = [
  {
    emoji: "🤖",
    icon: Bot,
    name: "AI Powered Chatbot",
    path: "/services/ai-chatbot",
    stat: "24/7 Available",
    desc: "Your always-on career mentor. Ask about career paths, the Pakistani job market, skills to learn, or what to do next — and get instant, expert-level responses.",
    bullets: ["Powered by Llama 3.3 via Groq", "Pakistan job market insights", "Career path discovery", "24/7 instant guidance"],
  },
  {
    emoji: "📄",
    icon: FileText,
    name: "Resume Builder",
    path: "/services/resume-builder",
    stat: "ATS-Friendly",
    desc: "Build professional, ATS-optimized resumes with a live editor. Use AI to rewrite your bullet points to be achievement-focused and stand out to recruiters.",
    bullets: ["Live preview editor", "AI bullet point rewriter", "ATS score checker", "PDF export"],
  },
  {
    emoji: "🎤",
    icon: MessageSquare,
    name: "Interview Preparation",
    path: "/services/interview-prep",
    stat: "AI Feedback",
    desc: "Practice with AI-generated interview questions for your target role. Answer by typing or use voice input, and receive detailed feedback on your performance.",
    bullets: ["Role-specific questions", "Voice input support", "AI feedback & scoring", "Unlimited practice sessions"],
  },
  {
    emoji: "🗺️",
    icon: Map,
    name: "Career Roadmap",
    path: "/services/roadmap",
    stat: "Step-by-Step",
    desc: "Get a personalized, step-by-step learning roadmap for your chosen career path — built by AI based on your goals, skills, and timeline.",
    bullets: ["Personalized to your goals", "Milestone tracking", "Resource recommendations", "Adjustable timelines"],
  },
  {
    emoji: "🎓",
    icon: GraduationCap,
    name: "AI Instructor",
    path: "/services/instructor",
    stat: "Learn Anything",
    desc: "Learn career-relevant topics through an AI instructor that explains concepts clearly, answers follow-up questions, and adapts to your pace.",
    bullets: ["Interactive lessons", "Follow-up Q&A", "Topic explanations", "Career-relevant content"],
  },
  {
    emoji: "🧠",
    icon: Brain,
    name: "Career Assessment",
    path: "/services/assessment",
    stat: "Find Your Path",
    desc: "Take a structured assessment to discover which career paths best match your skills, interests, and strengths — powered by AI prediction.",
    bullets: ["20-question assessment", "AI career prediction", "Strength analysis", "Instant results"],
  },
];

const Services = () => {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative py-24 lg:py-32 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">All services — 100% free</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            A complete{" "}
            <span className="text-gradient-gold">career toolkit</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Six powerful AI tools, one unified platform — engineered to take you from where you are to where you want to be. No subscription, no limits.
          </p>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="container pb-24 pt-4">
        <div className="space-y-6">
          {services.map((s, i) => (
            <div key={s.path} className="glass-card-hover rounded-2xl overflow-hidden group">
              <div className="grid lg:grid-cols-[1fr_auto] gap-0">
                <div className="p-8 lg:p-10">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center text-3xl shrink-0 group-hover:border-primary/60 group-hover:bg-primary/10 transition-all">
                      {s.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">{s.name}</h3>
                        <span className="text-xs text-primary font-medium bg-primary/10 px-2.5 py-0.5 rounded-full">{s.stat}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                      <ul className="flex flex-wrap gap-2">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="px-8 pb-8 lg:px-10 lg:pb-0 lg:flex lg:items-center">
                  <Button asChild variant={i === 0 ? "hero" : "outline"} size="sm">
                    <Link to={s.path}>
                      Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
        <div className="relative glass-card rounded-3xl p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative max-w-xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Try all tools{" "}
              <span className="text-gradient-gold">for free</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Create your free account and get instant access to every Career Genie tool — no credit card required.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
