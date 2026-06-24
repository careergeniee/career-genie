import { Link } from "react-router-dom";
import { Bot, FileText, MessageSquare, Map, GraduationCap, Brain, ArrowRight, Sparkles, Check } from "lucide-react";
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
    featured: true,
  },
  {
    emoji: "📄",
    icon: FileText,
    name: "Resume Builder",
    path: "/services/resume-builder",
    stat: "ATS-Friendly",
    desc: "Build professional, ATS-optimized resumes with a live editor. Use AI to rewrite your bullet points to be achievement-focused and stand out to recruiters.",
    bullets: ["Live preview editor", "AI bullet point rewriter", "ATS score checker", "PDF export"],
    featured: false,
  },
  {
    emoji: "🎤",
    icon: MessageSquare,
    name: "Interview Preparation",
    path: "/services/interview-prep",
    stat: "AI Feedback",
    desc: "Practice with AI-generated interview questions for your target role. Answer by typing or use voice input, and receive detailed feedback on your performance.",
    bullets: ["Role-specific questions", "Voice input support", "AI feedback & scoring", "Unlimited practice sessions"],
    featured: false,
  },
  {
    emoji: "🗺️",
    icon: Map,
    name: "Career Roadmap",
    path: "/services/roadmap",
    stat: "Step-by-Step",
    desc: "Get a personalized, step-by-step learning roadmap for your chosen career path — built by AI based on your goals, skills, and timeline.",
    bullets: ["Personalized to your goals", "Milestone tracking", "Resource recommendations", "Adjustable timelines"],
    featured: false,
  },
  {
    emoji: "🎓",
    icon: GraduationCap,
    name: "AI Instructor",
    path: "/services/instructor",
    stat: "Learn Anything",
    desc: "Learn career-relevant topics through an AI instructor that explains concepts clearly, answers follow-up questions, and adapts to your pace.",
    bullets: ["Interactive lessons", "Follow-up Q&A", "Topic explanations", "Career-relevant content"],
    featured: false,
  },
  {
    emoji: "🧠",
    icon: Brain,
    name: "Career Assessment",
    path: "/services/assessment",
    stat: "Find Your Path",
    desc: "Take a structured assessment to discover which career paths best match your skills, interests, and strengths — powered by AI prediction.",
    bullets: ["20-question assessment", "AI career prediction", "Strength analysis", "Instant results"],
    featured: false,
  },
];

const Services = () => {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="neo-hero-bg pt-28 pb-20">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="neo-badge mx-auto mb-6 w-fit">
            <Sparkles className="w-3 h-3" /> All Services — 100% Free
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter text-primary-foreground mb-6">
            A COMPLETE<br />
            <span className="inline-block bg-background text-foreground px-4 py-1 border-2 border-foreground -rotate-1 mt-2">
              CAREER TOOLKIT
            </span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto leading-relaxed font-medium">
            Six powerful AI tools, one unified platform — engineered to take you from where you are to where you want to be.
          </p>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="container py-20 space-y-5">
        {services.map((s, i) => (
          <div key={s.path} className={`neo-card rounded-2xl overflow-hidden ${s.featured ? "neo-card-primary" : ""}`}>
            <div className="grid lg:grid-cols-[1fr_auto]">
              <div className="p-8 lg:p-10">
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-xl border-2 border-foreground flex items-center justify-center text-3xl shrink-0 ${s.featured ? "bg-primary-foreground" : "bg-secondary"}`}>
                    {s.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display text-xl font-black">{s.name}</h3>
                      <span className="neo-tag">{s.stat}</span>
                      {s.featured && <span className="neo-badge text-[10px] py-0.5">★ Featured</span>}
                    </div>
                    <p className={`text-sm leading-relaxed mb-4 ${s.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.desc}</p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-1.5 text-xs font-semibold">
                          <Check className={`w-3.5 h-3.5 shrink-0 ${s.featured ? "text-primary-foreground" : "text-primary"}`} />
                          <span className={s.featured ? "text-primary-foreground/80" : "text-muted-foreground"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8 lg:px-10 lg:pb-0 lg:flex lg:items-center border-t-2 lg:border-t-0 lg:border-l-2 border-foreground bg-background/10">
                <Button asChild className={`neo-btn font-bold ${s.featured ? "bg-background text-foreground hover:bg-background" : ""}`} variant={s.featured ? "default" : "outline"} size="sm">
                  <Link to={s.path}>
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="container pb-28">
        <div className="neo-card-primary rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-4 right-6 text-6xl font-black text-primary-foreground/10 select-none">✦</div>
          <div className="relative max-w-xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-4 text-primary-foreground">
              Try all tools for free.
            </h2>
            <p className="text-primary-foreground/80 mb-8 font-medium">
              Create your free account and get instant access to every Career Genie tool — no credit card required.
            </p>
            <Button asChild size="xl" className="neo-btn bg-background text-foreground hover:bg-background font-bold text-base px-8">
              <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
