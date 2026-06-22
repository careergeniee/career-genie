import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";
import { GenieHero } from "@/components/GenieHero";
import {
  Bot, FileText, Map, Brain,
  ArrowRight, Sparkles, Zap, Mic, Wand2, BarChart3, MessageSquare, GraduationCap
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Career Chatbot",
    desc: "Chat with an AI career mentor powered by Llama 3.3. Get guidance on career paths, jobs, skills, and the Pakistani job market — 24/7.",
    path: "/dashboard/chat",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    desc: "Build a professional resume with live editing. Use AI to rewrite your experience bullets to be more impactful and ATS-friendly.",
    path: "/dashboard/resume",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation",
    desc: "Practice with AI-generated interview questions for your target role. Answer by typing or use voice input, then get AI feedback.",
    path: "/dashboard/interview",
  },
  {
    icon: Map,
    title: "Career Roadmap",
    desc: "Get a personalized step-by-step learning roadmap for your chosen career path, built by AI based on your goals.",
    path: "/dashboard/roadmap",
  },
  {
    icon: GraduationCap,
    title: "AI Instructor",
    desc: "Learn career-relevant topics through an AI-powered instructor that explains concepts and answers your questions interactively.",
    path: "/dashboard/instructor",
  },
  {
    icon: Brain,
    title: "Career Assessment",
    desc: "Take a structured assessment to discover which career paths best match your skills, interests, and strengths.",
    path: "/dashboard/assessment",
  },
];

const highlights = [
  { icon: Wand2, label: "AI Bullet Rewriter", desc: "Rewrites resume bullets to be achievement-focused with one click" },
  { icon: Mic, label: "Voice Input", desc: "Speak your interview answers aloud using your microphone" },
  { icon: BarChart3, label: "Career Prediction", desc: "AI predicts your best-fit careers based on your assessment results" },
];

const Index = () => {
  return (
    <div>
      {/* HERO */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
          <div className="space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">AI-powered career platform for Pakistani students</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Unlock Your <br />
              <span className="text-gradient-gold">Career Potential</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              AI tools to discover your path, build the perfect resume, ace interviews, and land the job you dream of.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild variant="hero" size="xl">
                <Link to="/login">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>

          {/* GENIE HERO ANIMATION */}
          <div className="relative animate-scale-in">
            <GenieHero />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">What's inside</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Everything in <span className="text-gradient-gold">Career Genie</span></h2>
          <p className="text-muted-foreground mt-4">Six AI-powered tools, all included — no subscription needed.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Link
              key={f.title}
              to={f.path}
              className="glass-card-hover rounded-2xl p-7 group block"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative w-14 h-14 mb-5">
                <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/60 transition-all" />
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-secondary to-muted border border-border flex items-center justify-center group-hover:border-primary/60 transition">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GlowOrbs />
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Built-in extras</p>
            <h2 className="font-display text-4xl font-bold">Standout <span className="text-gradient-gold">Features</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {highlights.map((h) => (
              <div key={h.label} className="glass-card rounded-2xl p-7 text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                  <h.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{h.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="relative glass-card rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/30 blur-[100px] rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/30 blur-[100px] rounded-full" />
          <div className="relative max-w-2xl mx-auto">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-gradient-gold">Start?</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Create a free account and access all Career Genie tools instantly.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">Create Free Account <Zap className="w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
