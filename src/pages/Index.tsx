import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Bot, FileText, Map, Brain, GraduationCap, MessageSquare,
  ArrowRight, Sparkles, Zap, Wand2, Mic, BarChart3, Plus, Minus,
  Quote, Star
} from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";

const tools = [
  { icon: Bot, emoji: "🤖", title: "AI Career Chatbot", stat: "24/7 Available", path: "/dashboard/chat" },
  { icon: FileText, emoji: "📄", title: "Resume Builder", stat: "ATS-Friendly", path: "/dashboard/resume" },
  { icon: MessageSquare, emoji: "🎤", title: "Interview Prep", stat: "AI Feedback", path: "/dashboard/interview" },
  { icon: Map, emoji: "🗺️", title: "Career Roadmap", stat: "Step-by-Step", path: "/dashboard/roadmap" },
  { icon: GraduationCap, emoji: "🎓", title: "AI Instructor", stat: "Learn Anything", path: "/dashboard/instructor" },
  { icon: Brain, emoji: "🧠", title: "Career Assessment", stat: "Find Your Path", path: "/dashboard/assessment" },
];

const whyItems = [
  {
    icon: Wand2,
    title: "Learn with AI",
    desc: "Access an intelligent career mentor, instructor, and assessment tool — all powered by advanced AI. Get guidance tailored to your goals, skills, and the Pakistani job market.",
  },
  {
    icon: Mic,
    title: "Build your profile",
    desc: "Craft an ATS-optimized resume, practice interviews with voice input, and follow a personalized roadmap. Every tool works together to strengthen your candidacy.",
  },
  {
    icon: BarChart3,
    title: "Land your dream role",
    desc: "From career discovery to offer letter — Career Genie gives you the clarity, confidence, and tools to compete at the highest level and win the job you deserve.",
  },
];

const testimonials = [
  {
    quote: "Career Genie's AI chatbot helped me figure out exactly which career path to take after graduation. The roadmap it generated was spot-on and I followed it to land my first dev job.",
    name: "Ahmed Raza",
    role: "Software Engineer, Lahore",
    initials: "AR",
  },
  {
    quote: "The resume builder is insane. It rewrote my bullet points and my ATS score went from 42 to 89. Got three interview calls the same week I updated my CV.",
    name: "Sana Malik",
    role: "Data Analyst, Karachi",
    initials: "SM",
  },
];

const faqs = [
  {
    q: "Is Career Genie completely free to use?",
    a: "Yes — all six AI tools are included for free. No subscription, no hidden fees. Create an account and get full access instantly.",
  },
  {
    q: "Who is Career Genie built for?",
    a: "Career Genie is built for Pakistani students and fresh graduates who want AI-powered guidance to discover, prepare for, and land the right career.",
  },
  {
    q: "How does the AI Career Chatbot work?",
    a: "It's powered by Llama 3.3 via Groq. You can ask it anything — career advice, job market questions, skill guidance — and get instant, intelligent responses.",
  },
  {
    q: "Can I use the Interview Prep tool with voice input?",
    a: "Absolutely. You can speak your answers aloud using your microphone. The AI listens, transcribes, and gives you detailed feedback on your response.",
  },
];

const Index = () => {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative hero-bg overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GlowOrbs />
        <div className="container relative py-24 lg:py-32 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">AI-powered career platform for Pakistani students</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Grab a seat,{" "}
            <span className="text-gradient-gold">unlock your career.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A smart corner of the internet where students discover paths, build perfect resumes, ace interviews, and land the roles they deserve — powered by AI.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-14">
            <Button asChild variant="hero" size="xl">
              <Link to="/login">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/services">Browse Tools</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {["6 AI Tools", "100% Free", "No Subscription", "Built for Students"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-border" />}
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Explore our tools</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Pick a tool,{" "}
            <span className="text-gradient-gold">start growing</span>
          </h2>
          <p className="text-muted-foreground mt-4">Six AI-powered modules — all included, all free, all built to move your career forward.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link
              key={t.title}
              to={t.path}
              className="glass-card-hover rounded-2xl p-6 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-2xl group-hover:border-primary/60 group-hover:bg-primary/10 transition-all">
                  {t.emoji}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors">{t.title}</h3>
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">{t.stat}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED TOOL ── */}
      <section className="container pb-24">
        <div className="relative glass-card rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />

          <div className="relative grid lg:grid-cols-2 gap-0">
            {/* Left: content */}
            <div className="p-10 lg:p-14">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/15 text-primary px-3 py-1 rounded-full mb-6">
                <Sparkles className="w-3 h-3" /> Featured Tool
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Meet your{" "}
                <span className="text-gradient-gold">AI Career Mentor</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Powered by Llama 3.3 via Groq, the AI Career Chatbot gives you instant, expert guidance on career paths, the Pakistani job market, skills to learn, and next steps — any time, any question.
              </p>
              <ul className="space-y-2 mb-8">
                {["Career path discovery", "Pakistan job market insights", "Skills & learning guidance", "24/7 instant responses"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild variant="hero" size="lg">
                <Link to="/dashboard/chat">Try it now <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>

            {/* Right: chat preview */}
            <div className="p-8 lg:p-10 flex items-center justify-center bg-secondary/30 border-l border-border/60">
              <div className="w-full max-w-sm glass-card rounded-2xl p-5 shadow-xl">
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
                  <div className="bg-secondary rounded-xl rounded-tl-none px-3 py-2 text-xs text-foreground max-w-[85%]">
                    What career suits a CS graduate in Pakistan?
                  </div>
                  <div className="bg-primary rounded-xl rounded-tr-none px-3 py-2 text-xs text-primary-foreground ml-auto max-w-[85%]">
                    Based on current demand, <strong>Software Engineering</strong> and <strong>Data Science</strong> are top picks. The freelancing market is booming too!
                  </div>
                  <div className="bg-secondary rounded-xl rounded-tl-none px-3 py-2 text-xs text-foreground max-w-[85%]">
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

      {/* ── WHY CAREER GENIE ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GlowOrbs />
        <div className="container relative">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Why Career Genie?</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Everything you need{" "}
              <span className="text-gradient-gold">in one place</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyItems.map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Success Stories</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Students who{" "}
            <span className="text-gradient-gold">made it happen</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card-hover rounded-2xl p-8">
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center font-display font-bold text-sm text-primary-foreground shrink-0">
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
      <section className="container pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">FAQ</p>
            <h2 className="font-display text-4xl font-bold">
              Common{" "}
              <span className="text-gradient-gold">questions</span>
            </h2>
          </div>
          <Accordion.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`faq-${i}`}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-semibold group hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                  {faq.q}
                  <Plus className="w-4 h-4 shrink-0 ml-4 group-data-[state=open]:hidden" />
                  <Minus className="w-4 h-4 shrink-0 ml-4 hidden group-data-[state=open]:block text-primary" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container pb-28">
        <div className="relative glass-card rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/25 blur-[100px] rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/25 blur-[100px] rounded-full" />
          <div className="relative max-w-xl mx-auto">
            <img src={genieLogo} alt="Career Genie" className="w-16 h-16 object-contain mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to{" "}
              <span className="text-gradient-gold">start?</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Create a free account and get instant access to all six Career Genie tools — no credit card, no subscription, no catch.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">Create Free Account <Zap className="w-4 h-4" /></Link>
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

export default Index;
