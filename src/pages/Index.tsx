import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="bg-background text-foreground">

      {/* ── HERO ── */}
      <section className="max-w-[1200px] mx-auto px-8 pt-20 pb-12 flex flex-col items-start">
        <h1 className="font-display font-bold leading-[1.05] tracking-[-0.03em] mb-8 max-w-3xl"
            style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>
          Navigate your CS{" "}
          <span className="text-primary">Path</span>
          <br />
          with confidence.
        </h1>
        <p className="text-muted-foreground max-w-xl mb-10 text-lg leading-relaxed">
          The definitive platform for ambitious Pakistani Computer Science students to map
          their careers, master skills, and land top-tier tech roles.
        </p>
        <Button asChild variant="hero" size="lg"
          className="rounded-[10px] px-8 py-4 text-[18px] h-auto font-semibold">
          <Link to="/signup">
            Start My Journey <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </section>

      {/* ── YOUR TOOLKIT ── */}
      <section className="py-12 w-full">
        <div className="max-w-[1200px] mx-auto px-8 mb-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">Your Toolkit</h2>
        </div>
        {/* HeroShowcase: fan animation — overflow-visible so cards can spread */}
        <div className="w-full overflow-visible px-8">
          <HeroShowcase />
        </div>
      </section>

      {/* ── HOW IT WORKS — 01 / 02 / 03 ── */}
      <section className="max-w-[1200px] mx-auto px-8 py-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              n: "01", title: "Assess",
              desc: "Identify your baseline with comprehensive technical and soft-skill evaluations tailored for the Pakistani market."
            },
            {
              n: "02", title: "Match",
              desc: "Discover career paths that align with your strengths, backed by ML models trained on 3,600+ real student data points."
            },
            {
              n: "03", title: "Master",
              desc: "Follow curated roadmaps, practice with AI, and engage with mentors to bridge the gap to your dream role."
            },
          ].map((s) => (
            <div key={s.n} className="relative pt-12">
              {/* Ghost number */}
              <div
                className="absolute top-0 left-0 font-display font-bold leading-none select-none text-border"
                style={{ fontSize: 80, opacity: 0.6 }}
              >
                {s.n}
              </div>
              <div className="relative">
                <h3 className="font-display text-2xl font-semibold mb-4 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full bg-foreground mt-12 py-20 px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2
            className="font-display font-bold text-background max-w-lg leading-[1.1] tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            Build your future<br />in Pakistan.
          </h2>
          <Button asChild size="lg"
            className="bg-primary text-primary-foreground hover:brightness-95 shrink-0 rounded-[10px] px-8 py-4 text-[18px] h-auto font-semibold shadow-[0_4px_14px_hsl(19_86%_40%_/_0.3)]">
            <Link to="/signup">Join CareerGenie</Link>
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Index;
