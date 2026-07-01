import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import BlurText from "@/components/BlurText";
import LineWaves from "@/components/LineWaves";
import BorderGlow from "@/components/BorderGlow";
import TextType from "@/components/TextType";
import AnimatedContent from "@/components/AnimatedContent";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="bg-background text-foreground">

      {/* ── HERO + TOOLKIT — share one fading line-wave background ── */}
      <div className="relative overflow-hidden">
        {/* Animated line-wave background, tinted in the site's burnt-sienna palette.
            Spans past the hero and fades out through the toolkit section instead of cutting off abruptly. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 95%)",
          }}
        >
          <LineWaves
            speed={0.3}
            innerLineCount={32}
            outerLineCount={36}
            warpIntensity={1.0}
            rotation={-45}
            edgeFadeWidth={0.15}
            colorCycleSpeed={0.4}
            brightness={0.22}
            color1="#c1440e"
            color2="#e8703a"
            color3="#7a2500"
            enableMouseInteraction={true}
            mouseInfluence={1.5}
          />
        </div>

        {/* ── HERO — asymmetric two-column ── */}
        <section className="relative max-w-[1200px] mx-auto px-8 pt-16 pb-0">
          <div className="relative items-start">

            {/* Headline + CTA */}
            <div>
              <div
                role="heading"
                aria-level={1}
                className="font-display font-bold leading-[1.0] tracking-[-0.04em] mb-8"
                style={{ fontSize: "clamp(48px, 7.5vw, 92px)" }}
              >
                <BlurText text="Navigate" animateBy="words" direction="top" delay={150} />
                <BlurText
                  text="your Path"
                  animateBy="words"
                  direction="top"
                  delay={150}
                  className="[&>span:last-child]:text-primary"
                />
                <BlurText text="with confidence." animateBy="words" direction="top" delay={150} />
              </div>
              <TextType
                as="p"
                text="The definitive platform for ambitious Pakistani Computer Science students — map careers, master skills, land top-tier tech roles."
                className="text-muted-foreground max-w-md mb-10 text-[15px] leading-relaxed"
                typingSpeed={18}
                initialDelay={600}
                loop={false}
                showCursor={true}
                hideCursorWhileTyping={false}
                cursorCharacter="|"
                cursorClassName="text-primary"
                startOnVisible={true}
              />
              <div className="flex flex-wrap items-center gap-4">
                <AnimatedContent direction="horizontal" distance={40} duration={0.8} delay={0.1} threshold={0}>
                  <Button asChild size="lg"
                    className="rounded-[10px] px-8 h-14 text-[16px] font-semibold bg-primary text-primary-foreground shadow-[0_4px_14px_hsl(19_86%_40%_/_0.35)] hover:brightness-90">
                    <Link to="/signup">Start My Journey <ArrowRight className="w-5 h-5" /></Link>
                  </Button>
                </AnimatedContent>
                <AnimatedContent direction="horizontal" distance={40} duration={0.8} delay={0.25} threshold={0}>
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                    Already have an account?
                  </Link>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </section>

        {/* ── YOUR TOOLKIT ── */}
        <section className="relative pt-20 pb-8 w-full">
          <div className="max-w-[1200px] mx-auto px-8 mb-8 flex items-baseline justify-between">
            <h2 className="font-display font-bold text-3xl tracking-tight">Your Toolkit</h2>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">7 modules</span>
          </div>
          <div className="w-full overflow-visible px-8">
            <HeroShowcase />
          </div>
        </section>
      </div>

      {/* ── HOW IT WORKS — glowing step cards ── */}
      <section className="max-w-[1200px] mx-auto px-8 pt-16 pb-20 mt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
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
            <BorderGlow
              key={s.n}
              backgroundColor="#FFFFFF"
              borderRadius={16}
              glowColor="19 86 40"
              glowRadius={30}
              coneSpread={30}
              colors={["#c1440e", "#e8703a", "#7a2500"]}
            >
              <div className="relative p-8">
                {/* Giant ghost number */}
                <div
                  className="absolute top-4 right-6 font-display font-bold leading-none select-none"
                  style={{ fontSize: 90, color: "hsl(var(--border))", opacity: 0.7 }}
                >
                  {s.n}
                </div>
                <div className="relative pt-8">
                  <h3 className="font-display text-2xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-[15px] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </BorderGlow>
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
