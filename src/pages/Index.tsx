import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";
import {
  Bot, FileText, MessageSquare, Map, GraduationCap, Globe2,
  ArrowRight, Sparkles, Zap, BarChart3, Target, CheckCircle2, TrendingUp, Award, Brain
} from "lucide-react";
import genieHero from "@/assets/genie-hero.webp";

const services = [
  { name: "AI Powered Chatbot", path: "/services/ai-chatbot", icon: Bot, desc: "Smart career assistant available 24/7 to guide your decisions." },
  { name: "Resume Builder", path: "/services/resume-builder", icon: FileText, desc: "Create stunning ATS-friendly resumes that get noticed." },
  { name: "Interview Preparation", path: "/services/interview-prep", icon: MessageSquare, desc: "Realistic mock interviews with instant AI feedback." },
  { name: "Roadmap Following", path: "/services/roadmap", icon: Map, desc: "Personalized step-by-step paths to your dream role." },
  { name: "Senior Instructor", path: "/services/instructor", icon: GraduationCap, desc: "Learn directly from industry-leading mentors." },
  { name: "3D Career Verse", path: "/services/career-verse", icon: Globe2, desc: "Step into immersive worlds and explore careers in 3D." },
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
              <span className="text-muted-foreground">AI-powered career platform</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Unlock Your <br />
              <span className="text-gradient-gold">Career Potential</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Magical AI tools to discover your path, build the perfect resume, ace interviews, and land the job you dream of.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild variant="hero" size="xl">
                <Link to="/login">Get Started Now <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-6">
              {[
                { v: "50+", l: "Careers launched" },
                { v: "98%", l: "Satisfaction" },
                { v: "24/7", l: "AI guidance" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-bold text-gradient-gold">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-purple opacity-30 blur-[100px] rounded-full" />
            <div className="absolute inset-10 bg-primary/20 blur-[80px] rounded-full animate-glow-pulse" />
            <img
              src={genieHero}
              alt="Career Genie holding glowing scroll of opportunities"
              width={640}
              height={640}
              fetchpriority="high"
              className="relative z-10 w-full max-w-lg mx-auto animate-float drop-shadow-[0_0_60px_hsl(48_96%_53%_/_0.3)]"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">How it works</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">How Career Genie <span className="text-gradient-gold">Works</span></h2>
          <p className="text-muted-foreground mt-4">Three powerful steps from confusion to clarity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: "Resume Builder", desc: "Generate beautiful ATS-optimized resumes tailored to each role you target.", cta: "Build resume", path: "/services/resume-builder" },
            { icon: Target, title: "Job Match Analyzer", desc: "Our AI scores your fit against job descriptions and tells you exactly what to improve.", cta: "Analyze match", path: "/services/ai-chatbot" },
            { icon: MessageSquare, title: "Interview Coach", desc: "Practice unlimited mock interviews with role-specific questions and instant feedback.", cta: "Start practice", path: "/services/interview-prep" },
          ].map((c, i) => (
            <div key={c.title} className="glass-card-hover rounded-2xl p-7 group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <c.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{c.desc}</p>
              <Button asChild variant="glass" size="sm">
                <Link to={c.path}>{c.cta} <ArrowRight className="w-3.5 h-3.5" /></Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GlowOrbs />
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Our services</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Everything you need to <span className="text-gradient-gold">grow</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link key={s.path} to={s.path} className="glass-card-hover rounded-2xl p-7 group block">
                <div className="relative w-14 h-14 mb-5">
                  <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/60 transition-all" />
                  <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-secondary to-muted border border-border flex items-center justify-center group-hover:border-primary/60 transition">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">{s.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-bold">Powerful Tools to <span className="text-gradient-gold">Supercharge</span> Your Career</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-7 lg:row-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resume analysis</span>
            </div>
            <h3 className="font-display text-2xl font-bold mb-1">Live ATS Score</h3>
            <p className="text-sm text-muted-foreground mb-6">Watch your resume score climb in real time.</p>

            <div className="relative aspect-square max-w-[260px] mx-auto my-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeDasharray="263.89" strokeDashoffset="50" className="drop-shadow-[0_0_10px_hsl(var(--primary))]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-display text-5xl font-bold text-gradient-gold">81</div>
                <div className="text-xs text-muted-foreground">ATS-ready</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { l: "Keyword match", v: 92 },
                { l: "Formatting", v: 88 },
                { l: "Experience clarity", v: 74 },
              ].map((m) => (
                <div key={m.l}>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">{m.l}</span><span className="font-semibold">{m.v}%</span></div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-gradient-gold rounded-full" style={{ width: `${m.v}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold">Career Dashboard</h3>
                <p className="text-sm text-muted-foreground">Your weekly progress overview</p>
              </div>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div className="grid grid-cols-7 gap-2 h-40 items-end">
              {[40, 65, 50, 80, 70, 95, 85].map((h, i) => (
                <div key={i} className="rounded-t-md bg-gradient-to-t from-primary/80 to-primary/20 hover:to-primary transition-all" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2 text-[10px] text-muted-foreground text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-7 lg:col-span-2 grid sm:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, l: "Goals hit", v: "12/15" },
              { icon: Award, l: "Skills added", v: "+8" },
              { icon: Brain, l: "Interview score", v: "A+" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-secondary/50 p-5 border border-border/60">
                <s.icon className="w-5 h-5 text-primary mb-3" />
                <div className="font-display text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
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
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Ready to <span className="text-gradient-gold">Transform</span> Your Career?</h2>
            <p className="text-muted-foreground mb-8 text-lg">Join 50,000+ professionals already growing with Career Genie.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="hero" size="xl"><Link to="/login">Get Started Now <Zap className="w-4 h-4" /></Link></Button>
              <Button asChild variant="outline" size="xl"><Link to="/contact">Schedule Free Consultation</Link></Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
