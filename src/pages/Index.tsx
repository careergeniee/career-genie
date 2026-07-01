import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="bg-background text-foreground">

      {/* ── HERO — asymmetric two-column ── */}
      <section className="max-w-[1200px] mx-auto px-8 pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-14 items-start">

          {/* Left: stacked stat blocks */}
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:pt-3 shrink-0">
            <div className="bg-foreground text-background rounded-xl p-5 shrink-0 md:shrink">
              <p className="font-display font-bold text-[36px] leading-none">96.4%</p>
              <p className="text-[9px] text-background/45 uppercase tracking-[0.12em] mt-2 font-medium">ML accuracy</p>
            </div>
            <div className="rounded-xl p-5 shrink-0 md:shrink border"
              style={{ background: "hsl(var(--primary)/0.07)", borderColor: "hsl(var(--primary)/0.18)" }}>
              <p className="font-display font-bold text-[30px] leading-none text-primary">3,625</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.12em] mt-2 font-medium">Students trained on</p>
            </div>
            <div className="bg-secondary rounded-xl p-5 shrink-0 md:shrink border border-border">
              <p className="font-display font-bold text-[24px] leading-none">7 tools</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.12em] mt-2 font-medium">One platform</p>
            </div>
          </div>

          {/* Right: massive headline + CTA */}
          <div>
            <h1
              className="font-display font-bold leading-[1.0] tracking-[-0.04em] mb-8"
              style={{ fontSize: "clamp(48px, 7.5vw, 92px)" }}
            >
              Navigate<br />
              your CS <span className="text-primary">Path</span><br />
              with confidence.
            </h1>
            <p className="text-muted-foreground max-w-md mb-10 text-[15px] leading-relaxed">
              The definitive platform for ambitious Pakistani Computer Science
              students — map careers, master skills, land top-tier tech roles.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg"
                className="rounded-[10px] px-8 h-14 text-[16px] font-semibold bg-primary text-primary-foreground shadow-[0_4px_14px_hsl(19_86%_40%_/_0.35)] hover:brightness-90">
                <Link to="/signup">Start My Journey <ArrowRight className="w-5 h-5" /></Link>
              </Button>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── YOUR TOOLKIT ── */}
      <section className="pt-20 pb-8 w-full">
        <div className="max-w-[1200px] mx-auto px-8 mb-8 flex items-baseline justify-between">
          <h2 className="font-display font-bold text-3xl tracking-tight">Your Toolkit</h2>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">7 modules</span>
        </div>
        <div className="w-full overflow-visible px-8">
          <HeroShowcase />
        </div>
      </section>

      {/* ── HOW IT WORKS — divided columns ── */}
      <section className="max-w-[1200px] mx-auto px-8 pt-16 pb-20 mt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            {
              n: "01", title: "Assess",
              desc: "Identify your baseline with comprehensive technical and soft-skill evaluations tailored for the Pakistani market.",
            },
            {
              n: "02", title: "Match",
              desc: "Discover career paths aligned with your strengths, backed by ML models trained on 3,625 real student data points.",
            },
            {
              n: "03", title: "Master",
              desc: "Follow curated roadmaps, practice with AI, and engage with mentors to bridge the gap to your dream role.",
            },
          ].map((s) => (
            <div key={s.n} className="relative pt-20 py-10 md:px-10 first:pl-0 last:pr-0">
              {/* Giant ghost number */}
              <div
                className="absolute top-4 left-0 md:left-10 first:left-0 font-display font-bold leading-none select-none"
                style={{ fontSize: 100, color: "hsl(var(--border))", opacity: 0.7 }}
              >
                {s.n}
              </div>
              <div className="relative">
                <h3 className="font-display text-2xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full bg-foreground py-24 px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <h2
            className="font-display font-bold text-background leading-[1.0] tracking-[-0.04em]"
            style={{ fontSize: "clamp(36px, 5vw, 68px)" }}
          >
            Build your future<br />in Pakistan.
          </h2>
          <div className="flex flex-col items-start gap-3 shrink-0">
            <Button asChild size="lg"
              className="rounded-[10px] px-8 h-14 text-[16px] font-semibold bg-primary text-primary-foreground shadow-[0_4px_14px_hsl(19_86%_40%_/_0.3)] hover:brightness-90">
              <Link to="/signup">Join CareerGenie <ArrowRight className="w-5 h-5" /></Link>
            </Button>
            <p className="text-background/35 text-[11px] uppercase tracking-[0.08em]">Free forever · No credit card</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
