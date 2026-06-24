import { Target, Eye, Heart, Users, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import genieLogo from "@/assets/genie-logo.png";
import { GlowOrbs } from "@/components/GlowOrbs";

const team = [
  { name: "Meraj ul Abdin", role: "Full Stack Developer", initials: "MA", bio: "Architected the core AI pipeline and backend integration." },
  { name: "M. Taha Tariq", role: "Full Stack Developer", initials: "MT", bio: "Built the resume engine, interview prep, and career assessment." },
  { name: "Haroon Shah Nawaz", role: "Full Stack Developer", initials: "HS", bio: "Designed the UI system and crafted the user experience end-to-end." },
];

const values = [
  {
    emoji: "🎯",
    title: "Our Mission",
    desc: "Empower every professional with AI tools and expert guidance to land roles they truly love.",
    points: ["AI-first career guidance", "Built for Pakistani students", "Free for everyone"],
  },
  {
    emoji: "👁️",
    title: "Our Vision",
    desc: "A world where career clarity is universal — not a privilege reserved for the well-connected.",
    points: ["Accessible to all", "No paywalls, ever", "Community-driven growth"],
  },
  {
    emoji: "❤️",
    title: "Our Values",
    desc: "Honesty, craftsmanship, and obsession with the user. We win when you win.",
    points: ["User success first", "Radical transparency", "Continuous improvement"],
  },
];

const stats = [
  { value: "6", label: "AI Tools" },
  { value: "100%", label: "Free Forever" },
  { value: "3", label: "Builders" },
  { value: "∞", label: "Possibilities" },
];

const timeline = [
  { step: "01", title: "The Problem", desc: "Pakistani students struggled to find structured, affordable career guidance that understood the local job market." },
  { step: "02", title: "The Idea", desc: "Three developers set out to build an AI platform that could serve as a personal career mentor for every student." },
  { step: "03", title: "The Build", desc: "Six months of late nights and weekend sprints — six AI tools, one unified platform." },
  { step: "04", title: "The Launch", desc: "Career Genie goes live, 100% free, for every student in Pakistan who dares to dream bigger." },
];

const About = () => {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative py-24 lg:py-36 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-8">
            <img src={genieLogo} alt="" className="w-4 h-4 object-contain" />
            <span className="text-muted-foreground">About Career Genie</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            We make careers{" "}
            <span className="text-gradient-gold">magical</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Career Genie was born from a simple belief: every person deserves a clear, confident path to a career they love. We blend AI with expert coaching to make that real — for students across Pakistan.
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-border bg-secondary/20">
        <div className="container py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-8 px-6">
                <div className="font-display text-4xl font-bold text-gradient-gold mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION / VALUES ── */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">What drives us</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Built with{" "}
            <span className="text-gradient-gold">purpose</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-background p-8 flex flex-col gap-5 hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
              <span className="text-4xl">{v.emoji}</span>
              <div>
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
              <ul className="space-y-1.5 mt-auto pt-4 border-t border-border">
                {v.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Check className="w-2 h-2 text-primary" />
                    </div>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY TIMELINE ── */}
      <section className="relative py-24 overflow-hidden bg-secondary/20">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Our story</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              How we got{" "}
              <span className="text-gradient-gold">here</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
            {timeline.map((t) => (
              <div key={t.step} className="rounded-2xl border border-border bg-background p-7 hover:border-primary/50 hover:shadow-sm transition-all duration-300">
                <div className="font-display text-4xl font-bold text-gradient-gold mb-3">{t.step}</div>
                <h3 className="font-display font-bold text-base mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="container py-24">
        <div className="text-center mb-14">
          <Users className="w-8 h-8 text-primary mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">The people behind it</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Meet the{" "}
            <span className="text-gradient-gold">team</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">Builders, coaches, and dreamers behind the magic.</p>
        </div>

        <div className="grid sm:grid-cols-3 max-w-3xl mx-auto gap-6">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl border border-border bg-background p-8 text-center hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-5 flex items-center justify-center font-display text-2xl font-bold text-white ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                {m.initials}
              </div>
              <h3 className="font-display font-bold text-base mb-1">{m.name}</h3>
              <span className="inline-block text-xs text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full mb-3">{m.role}</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container pb-28">
        <div className="relative rounded-3xl overflow-hidden bg-foreground text-background px-10 md:px-16 py-16 text-center">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/30 blur-[100px] rounded-full" />
          <div className="relative max-w-xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-background">
              Ready to begin your{" "}
              <span className="text-primary">journey?</span>
            </h2>
            <p className="text-background/70 mb-8 text-sm leading-relaxed">
              Join thousands of students using Career Genie to discover, prepare, and land their dream careers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
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

export default About;
