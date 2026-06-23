import { Target, Eye, Heart, Users, ArrowRight } from "lucide-react";
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
  { icon: Target, title: "Our Mission", desc: "Empower every professional with AI tools and expert guidance to land roles they truly love." },
  { icon: Eye, title: "Our Vision", desc: "A world where career clarity is universal — not a privilege reserved for the well-connected." },
  { icon: Heart, title: "Our Values", desc: "Honesty, craftsmanship, and obsession with the user. We win when you win." },
];

const stats = [
  { value: "6", label: "AI Tools" },
  { value: "100%", label: "Free Forever" },
  { value: "3", label: "Builders" },
  { value: "∞", label: "Possibilities" },
];

const About = () => {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative py-24 lg:py-32 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-8">
            <img src={genieLogo} alt="" className="w-5 h-5 object-contain" />
            <span className="text-muted-foreground">About Career Genie</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            We make careers{" "}
            <span className="text-gradient-gold">magical</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Career Genie was born from a simple belief: every person deserves a clear, confident path to a career they love. We blend AI with expert coaching to make that real — for students across Pakistan.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="container py-16">
        <div className="glass-card rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-border">
            {stats.map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className="font-display text-4xl font-bold text-gradient-gold mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION / VALUES ── */}
      <section className="container pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">What drives us</p>
          <h2 className="font-display text-4xl font-bold">
            Built with{" "}
            <span className="text-gradient-gold">purpose</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="glass-card-hover rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
                <v.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-3">{v.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GlowOrbs />
        <div className="container relative">
          <div className="text-center mb-14">
            <Users className="w-10 h-10 text-primary mx-auto mb-4" />
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">The people behind it</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Meet the{" "}
              <span className="text-gradient-gold">team</span>
            </h2>
            <p className="text-muted-foreground mt-3">Builders, coaches, and dreamers behind the magic.</p>
          </div>
          <div className="grid sm:grid-cols-3 max-w-3xl mx-auto gap-6">
            {team.map((m) => (
              <div key={m.name} className="glass-card-hover rounded-2xl p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-gold mx-auto mb-5 flex items-center justify-center font-display text-3xl font-bold text-primary-foreground ring-2 ring-offset-2 ring-offset-background ring-primary/40">
                  {m.initials}
                </div>
                <h3 className="font-display font-bold text-lg mb-1">{m.name}</h3>
                <span className="inline-block text-xs text-primary font-medium bg-primary/10 px-2.5 py-0.5 rounded-full mb-3">{m.role}</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container pb-28">
        <div className="relative glass-card rounded-3xl p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative max-w-xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to begin your{" "}
              <span className="text-gradient-gold">journey?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students using Career Genie to discover, prepare, and land their dream careers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
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

export default About;
