import { Target, Eye, Heart, Users } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import { GlowOrbs } from "@/components/GlowOrbs";

const team = [
  { name: "Meraj", role: "Developer", initials: "M" },
  { name: "Taha", role: "Developer", initials: "T" },
  { name: "Haroon", role: "Developer", initials: "H" },
];

const About = () => {
  return (
    <div>
      <section className="relative hero-bg overflow-hidden">
        <GlowOrbs />
        <div className="container relative py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-6">
            <img src={genieLogo} alt="" className="w-5 h-5 object-contain" /> About Career Genie
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5">We make careers <span className="text-gradient-gold">magical</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Career Genie was born from a simple belief: every person deserves a clear, confident path to a career they love. We blend AI with expert coaching to make that real.</p>
        </div>
      </section>

      <section className="container py-20 grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "Our Mission", desc: "Empower every professional with AI tools and expert guidance to land roles they truly love." },
          { icon: Eye, title: "Our Vision", desc: "A world where career clarity is universal — not a privilege reserved for the well-connected." },
          { icon: Heart, title: "Our Values", desc: "Honesty, craftsmanship, and obsession with the user. We win when you win." },
        ].map((c) => (
          <div key={c.title} className="glass-card-hover rounded-2xl p-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
              <c.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">{c.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </section>

      <section className="container py-20">
        <div className="text-center mb-14">
          <Users className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-bold">Meet the <span className="text-gradient-gold">team</span></h2>
          <p className="text-muted-foreground mt-3">Builders, coaches, and dreamers behind the magic.</p>
        </div>
        <div className="grid sm:grid-cols-3 max-w-3xl mx-auto gap-6">
          {team.map((m) => (
            <div key={m.name} className="glass-card-hover rounded-2xl p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-gold mx-auto mb-4 flex items-center justify-center font-display text-2xl font-bold text-primary-foreground shadow-[0_0_30px_hsl(48_96%_53%_/_0.4)]">{m.initials}</div>
              <h3 className="font-display font-bold text-lg">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;