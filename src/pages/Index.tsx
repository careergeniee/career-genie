import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";
import {
  Bot, FileText, Map, Brain,
  ArrowRight, Sparkles, Zap, Mic, Wand2, BarChart3, Send, Check, MessageSquare, GraduationCap
} from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import genieLogo2 from "@/assets/genie-logo2.png";

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

          {/* MODULE COLLAGE */}
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-primary/10 blur-[70px] rounded-3xl animate-glow-pulse" />
            <div className="relative grid grid-cols-2 gap-3 max-w-lg mx-auto">

              {/* AI Chatbot */}
              <div className="glass-card rounded-2xl p-3 shadow-lg border border-border">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border">
                  <div className="w-5 h-5 rounded-md bg-gradient-gold flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-[11px] font-bold">AI Chatbot</span>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-secondary rounded-lg rounded-tl-none px-2 py-1.5 text-[9px] text-foreground leading-snug">
                    What career suits a CS graduate in Pakistan?
                  </div>
                  <div className="bg-primary rounded-lg rounded-tr-none px-2 py-1.5 text-[9px] text-primary-foreground ml-3 leading-snug">
                    Data Science & Software Engineering are top matches for your profile!
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1">
                    <span className="flex-1 text-[8px] text-muted-foreground">Ask anything...</span>
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Send className="w-2 h-2 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Builder */}
              <div className="glass-card rounded-2xl p-3 shadow-lg border border-border">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border">
                  <div className="w-5 h-5 rounded-md bg-gradient-gold flex items-center justify-center shrink-0">
                    <FileText className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-[11px] font-bold">Resume Builder</span>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-sm border border-border/40">
                  <div className="font-bold text-[9px] text-center text-foreground">Muhammad Taha</div>
                  <div className="text-center text-[8px] text-muted-foreground mb-1.5">taha@email.com · Lahore</div>
                  <div className="text-[8px] font-semibold text-foreground mb-0.5">Experience</div>
                  <div className="text-[7px] text-muted-foreground mb-1 pl-1">Software Intern — TechCorp</div>
                  <div className="text-[8px] font-semibold text-foreground mb-0.5">Skills</div>
                  <div className="flex gap-1 flex-wrap pl-1">
                    {["Python", "React", "SQL"].map((s) => (
                      <span key={s} className="bg-primary/15 text-primary text-[7px] px-1 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex-1 bg-secondary rounded-full h-1.5">
                    <div className="bg-primary rounded-full h-1.5 w-3/4" />
                  </div>
                  <span className="text-[9px] text-primary font-bold">ATS 78</span>
                </div>
              </div>

              {/* Career Assessment */}
              <div className="glass-card rounded-2xl p-3 shadow-lg border border-border">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border">
                  <div className="w-5 h-5 rounded-md bg-gradient-gold flex items-center justify-center shrink-0">
                    <Brain className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-[11px] font-bold">Assessment</span>
                </div>
                <div className="text-[9px] text-foreground mb-2 leading-snug font-medium">
                  I enjoy solving complex logical problems.
                </div>
                <div className="space-y-1">
                  {["Disagree", "Neutral", "Agree", "Strongly Agree"].map((l, i) => (
                    <div key={l} className={`rounded-md px-2 py-1 text-[8px] border ${i === 2 ? "bg-primary/15 border-primary text-primary font-semibold" : "border-border text-muted-foreground"}`}>
                      {l}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex-1 bg-secondary rounded-full h-1">
                    <div className="bg-primary rounded-full h-1 w-2/5" />
                  </div>
                  <span className="text-[8px] text-muted-foreground">8/20</span>
                </div>
              </div>

              {/* Career Roadmap */}
              <div className="glass-card rounded-2xl p-3 shadow-lg border border-border">
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border">
                  <div className="w-5 h-5 rounded-md bg-gradient-gold flex items-center justify-center shrink-0">
                    <Map className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-[11px] font-bold">Career Roadmap</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { title: "Python Basics", done: true },
                    { title: "Data Analysis", done: true },
                    { title: "ML Fundamentals", done: false },
                    { title: "Projects & Portfolio", done: false },
                  ].map((p) => (
                    <div key={p.title} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${p.done ? "bg-primary" : "border border-border bg-secondary"}`}>
                        {p.done && <Check className="w-2 h-2 text-primary-foreground" />}
                      </div>
                      <span className={`text-[9px] ${p.done ? "text-foreground font-medium line-through opacity-60" : "text-foreground"}`}>{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
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
            <img src={genieLogo2} alt="Career Genie" className="w-20 h-20 object-contain mx-auto mb-6" />
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
