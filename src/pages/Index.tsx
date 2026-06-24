import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Bot, FileText, Map, Brain, GraduationCap, MessageSquare,
  ArrowRight, Sparkles, Zap, Plus, Minus, Quote, Star, Check,
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

const bundles = [
  {
    emoji: "🌟",
    title: "Discover",
    subtitle: "Find your direction",
    tools: ["AI Career Chatbot", "Career Assessment"],
    features: ["Career path discovery", "Pakistan job market insights", "Strength & interest analysis", "Instant AI responses"],
    path: "/dashboard/chat",
  },
  {
    emoji: "⚡",
    title: "Build",
    subtitle: "Prepare to compete",
    tools: ["Resume Builder", "Interview Preparation"],
    features: ["ATS score checker", "AI bullet point rewriter", "Voice interview practice", "Unlimited mock sessions"],
    path: "/dashboard/resume",
    featured: true,
  },
  {
    emoji: "🚀",
    title: "Grow",
    subtitle: "Accelerate your progress",
    tools: ["Career Roadmap", "AI Instructor"],
    features: ["Personalized step-by-step plan", "Milestone tracking", "Adaptive AI lessons", "Career-relevant content"],
    path: "/dashboard/roadmap",
  },
];

const stats = [
  { value: "6", label: "AI Tools" },
  { value: "100%", label: "Free Forever" },
  { value: "4.9★", label: "Student Rating" },
  { value: "∞", label: "Career Paths" },
];

const faqCategories = [
  {
    emoji: "🆓",
    title: "Pricing & Access",
    faqs: [
      { q: "Is Career Genie completely free to use?", a: "Yes — all six AI tools are included for free. No subscription, no hidden fees. Create an account and get full access instantly." },
      { q: "Is there a premium tier planned?", a: "We plan to keep the core tools free forever. Career Genie is built for Pakistani students who shouldn't have to pay for career guidance." },
    ],
  },
  {
    emoji: "🤖",
    title: "About the AI",
    faqs: [
      { q: "How does the AI Career Chatbot work?", a: "It's powered by Llama 3.3 via Groq. Ask it anything — career advice, job market questions, skill guidance — and get instant, expert responses." },
      { q: "Can I use Interview Prep with voice input?", a: "Absolutely. Speak your answers using your microphone. The AI listens, transcribes, and gives you detailed feedback and scoring on your response." },
    ],
  },
  {
    emoji: "🎓",
    title: "Getting Started",
    faqs: [
      { q: "Who is Career Genie built for?", a: "Career Genie is built for Pakistani students and fresh graduates who want AI-powered guidance to discover, prepare for, and land the right career." },
      { q: "Do I need an account to use the tools?", a: "Yes — a free account lets you save your progress, resumes, and roadmaps. Sign up in under a minute with your email." },
    ],
  },
];

const testimonials = [
  {
    quote: "Career Genie's AI chatbot helped me figure out exactly which career path to take after graduation. The roadmap it generated was spot-on and I followed it to land my first dev job.",
    name: "Ahmed Raza",
    role: "Software Engineer, Lahore",
    initials: "AR",
    stars: 5,
  },
  {
    quote: "The resume builder is insane. It rewrote my bullet points and my ATS score went from 42 to 89. Got three interview calls the same week I updated my CV.",
    name: "Sana Malik",
    role: "Data Analyst, Karachi",
    initials: "SM",
    stars: 5,
  },
];

const Index = () => {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative py-24 lg:py-36 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">AI-powered career platform — 100% free</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Your smartest move<br />
            <span className="text-gradient-gold">starts right here.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Six AI tools. One platform. Built for Pakistani students who want to discover their path, build a standout profile, and land the career they deserve.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Button asChild variant="hero" size="xl">
              <Link to="/signup">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/services">Browse Tools</Link>
            </Button>
          </div>

          {/* Inline stats */}
          <div className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8 py-4 glass-card rounded-2xl">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-5">
                {i > 0 && <span className="hidden sm:block w-px h-6 bg-border" />}
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-gradient-gold leading-none">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="container py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">The toolkit</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Six tools,{" "}
              <span className="text-gradient-gold">one mission</span>
            </h2>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link to="/services">View all services <ArrowRight className="w-3.5 h-3.5" /></Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {tools.map((t) => (
            <Link
              key={t.title}
              to={t.path}
              className="group bg-background hover:bg-secondary/40 transition-colors duration-200 p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{t.emoji}</span>
                <span className="text-xs text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full">{t.stat}</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors mb-1">{t.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
              <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open tool <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURE BUNDLES ── */}
      <section className="relative py-24 overflow-hidden bg-secondary/20">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GlowOrbs />
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">What you get</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Everything included,{" "}
              <span className="text-gradient-gold">always free</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              No tiers, no paywalls. Here's how the tools group together to move you forward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bundles.map((b) => (
              <div
                key={b.title}
                className={`relative rounded-2xl p-8 flex flex-col gap-6 border transition-all duration-300 hover:-translate-y-1 ${
                  b.featured
                    ? "bg-foreground text-background border-foreground shadow-2xl"
                    : "bg-background border-border hover:border-primary/60 hover:shadow-lg"
                }`}
              >
                {b.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div>
                  <span className="text-4xl block mb-4">{b.emoji}</span>
                  <h3 className={`font-display text-2xl font-bold mb-1 ${b.featured ? "text-background" : ""}`}>{b.title}</h3>
                  <p className={`text-sm ${b.featured ? "text-background/70" : "text-muted-foreground"}`}>{b.subtitle}</p>
                </div>

                <div className={`text-xs font-semibold uppercase tracking-widest pb-3 border-b ${b.featured ? "border-background/20 text-background/60" : "border-border text-muted-foreground"}`}>
                  Includes
                </div>

                <ul className="space-y-2.5">
                  {b.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${b.featured ? "bg-primary" : "bg-primary/15"}`}>
                        <Check className={`w-2.5 h-2.5 ${b.featured ? "text-white" : "text-primary"}`} />
                      </div>
                      <span className={b.featured ? "text-background/90" : "text-foreground/80"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <Button
                    asChild
                    variant={b.featured ? "outline" : "hero"}
                    size="sm"
                    className={`w-full ${b.featured ? "border-background/30 text-background hover:bg-background/10" : ""}`}
                  >
                    <Link to={b.path}>{b.featured ? "Start building →" : `${b.title === "Discover" ? "Start discovering →" : "Start growing →"}`}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CHATBOT ── */}
      <section className="container py-24">
        <div className="relative rounded-3xl overflow-hidden border border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/15 blur-[100px] rounded-full" />

          <div className="relative grid lg:grid-cols-2 gap-0">
            <div className="p-10 lg:p-14">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary/15 text-primary px-3 py-1 rounded-full mb-6">
                <Sparkles className="w-3 h-3" /> Featured Tool
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Meet your{" "}
                <span className="text-gradient-gold">AI Career Mentor</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Powered by Llama 3.3 via Groq, the AI Career Chatbot gives you instant, expert guidance on career paths, the Pakistani job market, skills to learn, and next steps — any time, any question.
              </p>
              <ul className="space-y-2 mb-8">
                {["Career path discovery", "Pakistan job market insights", "Skills & learning guidance", "24/7 instant responses"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="hero" size="lg">
                <Link to="/dashboard/chat">Try it now <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>

            <div className="p-8 lg:p-10 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-border bg-secondary/20">
              <div className="w-full max-w-sm glass-card rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Career Genie AI</div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-secondary rounded-xl rounded-tl-none px-3 py-2 text-xs max-w-[85%]">
                    What career suits a CS graduate in Pakistan?
                  </div>
                  <div className="bg-primary rounded-xl rounded-tr-none px-3 py-2 text-xs text-primary-foreground ml-auto max-w-[85%]">
                    Based on current demand, <strong>Software Engineering</strong> and <strong>Data Science</strong> are top picks. Freelancing is booming too!
                  </div>
                  <div className="bg-secondary rounded-xl rounded-tl-none px-3 py-2 text-xs max-w-[85%]">
                    Which skills should I learn first?
                  </div>
                  <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                    <span className="flex-1 text-xs text-muted-foreground">Ask anything...</span>
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="container pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Success Stories</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Students who{" "}
            <span className="text-gradient-gold">made it happen</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-background p-8 flex flex-col gap-5 hover:border-primary/50 hover:shadow-md transition-all duration-300">
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <Quote className="w-7 h-7 text-primary/25" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display font-bold text-sm text-white shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative py-24 overflow-hidden bg-secondary/20">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">FAQ</p>
            <h2 className="font-display text-4xl font-bold">
              Common <span className="text-gradient-gold">questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto grid gap-8">
            {faqCategories.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{cat.emoji}</span>
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">{cat.title}</h3>
                </div>
                <Accordion.Root type="single" collapsible className="space-y-2">
                  {cat.faqs.map((faq, i) => (
                    <Accordion.Item
                      key={i}
                      value={`${cat.title}-${i}`}
                      className="rounded-xl border border-border bg-background overflow-hidden"
                    >
                      <Accordion.Trigger className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold group hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                        {faq.q}
                        <Plus className="w-4 h-4 shrink-0 ml-4 text-muted-foreground group-data-[state=open]:hidden" />
                        <Minus className="w-4 h-4 shrink-0 ml-4 hidden group-data-[state=open]:block text-primary" />
                      </Accordion.Trigger>
                      <Accordion.Content className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden border-t border-border/60 pt-3">
                        {faq.a}
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
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
