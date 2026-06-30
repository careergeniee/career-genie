import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import {
  ArrowRight, Zap, Search, Layers, Trophy,
} from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";

const tools = [
  { emoji: "🤖", title: "AI Career Chatbot", desc: "Ask anything about your career path, the Pakistan job market, or skills to learn.", stat: "24/7", path: "/dashboard/chat" },
  { emoji: "📄", title: "Resume Builder", desc: "Build an ATS-optimized resume with AI-powered bullet point rewrites.", stat: "ATS-Friendly", path: "/dashboard/resume" },
  { emoji: "🎤", title: "Interview Prep", desc: "Practice with role-specific questions and get AI scoring on your answers.", stat: "AI Feedback", path: "/dashboard/interview" },
  { emoji: "🗺️", title: "Career Roadmap", desc: "Get a personalized step-by-step plan for your chosen career path.", stat: "Step-by-Step", path: "/dashboard/roadmap" },
  { emoji: "🎓", title: "AI Instructor", desc: "Learn career-relevant topics through an adaptive AI instructor.", stat: "Learn Anything", path: "/dashboard/instructor" },
  { emoji: "🧠", title: "Career Assessment", desc: "Discover which careers best match your strengths, skills, and interests.", stat: "Find Your Path", path: "/dashboard/assessment" },
];

const Index = () => {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center">
            {/* Left: copy + live product showcase */}
            <div>
              <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
                Pakistan's AI platform<br />
                <span className="text-gradient-gold">for career success.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mb-9 leading-relaxed">
                Discover your path, build a standout profile, and land the career you deserve — with six AI tools built specifically for Pakistani students.
              </p>

              <div className="flex flex-wrap gap-4 mb-16">
                <Button asChild variant="hero" size="xl">
                  <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/services">Browse Tools</Link>
                </Button>
              </div>

              <HeroShowcase />
            </div>

            {/* Right: the toolkit */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">The toolkit</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Six tools, <span className="text-gradient-gold">one mission</span>
              </h2>

              <div className="grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
                {tools.map((t) => (
                  <Link
                    key={t.title}
                    to={t.path}
                    className="group bg-background hover:bg-secondary/40 transition-colors duration-200 p-5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">{t.stat}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors mb-0.5">{t.title}</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{t.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-y border-border bg-secondary/20">
        <div className="container py-0">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { icon: Search, step: "01", title: "Discover", desc: "Find the right career path for your skills and interests." },
              { icon: Layers, step: "02", title: "Build", desc: "Create a winning resume and ace your interviews with AI." },
              { icon: Trophy, step: "03", title: "Land", desc: "Follow your roadmap and get the job you've been working toward." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-8 px-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-primary/50">{s.step}</span>
                    <span className="font-display font-bold text-sm">{s.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container py-28">
        <div className="relative rounded-3xl overflow-hidden bg-foreground text-background px-10 md:px-16 py-16 text-center">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/30 blur-[100px] rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative max-w-xl mx-auto">
            <img src={genieLogo} alt="Career Genie" className="w-14 h-14 object-contain mx-auto mb-6 opacity-90" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-background">
              Ready to{" "}
              <span className="text-primary">start?</span>
            </h2>
            <p className="text-background/70 mb-10 leading-relaxed text-sm">
              Create a free account and get instant access to all six Career Genie tools — no credit card, no subscription, no catch.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                <Link to="/signup">Create Free Account <Zap className="w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-background/30 text-background hover:bg-background/10">
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
