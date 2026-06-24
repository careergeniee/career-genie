import { Target, Eye, Heart, Users, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import genieLogo from "@/assets/genie-logo.png";

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
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="neo-hero-bg pt-28 pb-20">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="neo-badge mx-auto mb-6 w-fit">
            <img src={genieLogo} alt="" className="w-4 h-4 object-contain" />
            About Career Genie
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter text-primary-foreground mb-6">
            WE MAKE<br />
            <span className="inline-block bg-background text-foreground px-4 py-1 border-2 border-foreground rotate-1 mt-2">
              CAREERS MAGICAL
            </span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto leading-relaxed font-medium">
            Career Genie was born from a simple belief: every person deserves a clear, confident path to a career they love — especially students across Pakistan.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="container py-16">
        <div className="neo-card rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-6 md:py-2 px-4">
                <div className="font-display text-5xl font-black text-primary mb-1">{s.value}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION / VALUES ── */}
      <section className="neo-section-alt py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">— What drives us</p>
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight">Built with purpose.</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={v.title} className={`neo-card rounded-2xl p-8 ${i === 1 ? "neo-card-primary" : ""}`}>
                <div className={`w-14 h-14 rounded-xl border-2 border-foreground flex items-center justify-center mb-5 ${i === 1 ? "bg-primary-foreground" : "bg-primary"}`}>
                  <v.icon className={`w-6 h-6 ${i === 1 ? "text-primary" : "text-primary-foreground"}`} />
                </div>
                <h2 className="font-display text-xl font-black mb-3">{v.title}</h2>
                <p className={`text-sm leading-relaxed ${i === 1 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="container py-24">
        <div className="text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">— The people behind it</p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight">
            Meet the team.
          </h2>
          <p className="text-muted-foreground mt-3 font-medium">Builders, coaches, and dreamers behind the magic.</p>
        </div>
        <div className="grid sm:grid-cols-3 max-w-3xl mx-auto gap-5">
          {team.map((m, i) => (
            <div key={m.name} className={`neo-card rounded-2xl p-8 text-center ${i === 1 ? "-rotate-1" : i === 2 ? "rotate-1" : ""}`}>
              <div className="w-20 h-20 rounded-xl bg-primary border-2 border-foreground mx-auto mb-5 flex items-center justify-center font-display text-3xl font-black text-primary-foreground">
                {m.initials}
              </div>
              <h3 className="font-display font-black text-lg mb-1">{m.name}</h3>
              <span className="neo-tag mb-3 inline-block">{m.role}</span>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container pb-28">
        <div className="neo-card-primary rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-4 right-6 text-6xl font-black text-primary-foreground/10 select-none">✦</div>
          <div className="relative max-w-xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-4 text-primary-foreground">
              Ready to begin your journey?
            </h2>
            <p className="text-primary-foreground/80 mb-8 font-medium">
              Join thousands of students using Career Genie to discover, prepare, and land their dream careers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="xl" className="neo-btn bg-background text-foreground hover:bg-background font-bold text-base px-8">
                <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="neo-btn border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-bold text-base px-8">
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
