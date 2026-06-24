import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Bot, FileText, Map, Brain, GraduationCap, MessageSquare,
  ArrowRight, Zap, Wand2, Mic, BarChart3, Plus, Minus, Quote,
  Sparkles, Check
} from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";

const tools = [
  { emoji: "🤖", title: "AI Career Chatbot", stat: "24/7 Available", path: "/dashboard/chat" },
  { emoji: "📄", title: "Resume Builder", stat: "ATS-Friendly", path: "/dashboard/resume" },
  { emoji: "🎤", title: "Interview Prep", stat: "AI Feedback", path: "/dashboard/interview" },
  { emoji: "🗺️", title: "Career Roadmap", stat: "Step-by-Step", path: "/dashboard/roadmap" },
  { emoji: "🎓", title: "AI Instructor", stat: "Learn Anything", path: "/dashboard/instructor" },
  { emoji: "🧠", title: "Career Assessment", stat: "Find Your Path", path: "/dashboard/assessment" },
];

const whyItems = [
  { icon: Wand2, title: "Learn with AI", desc: "Access an intelligent career mentor, instructor, and assessment tool. Get guidance tailored to your goals and the Pakistani job market." },
  { icon: Mic, title: "Build your profile", desc: "Craft an ATS-optimized resume, practice interviews with voice input, and follow a personalized roadmap that strengthens your candidacy." },
  { icon: BarChart3, title: "Land your dream role", desc: "From career discovery to offer letter — Career Genie gives you the clarity, confidence, and tools to win the job you deserve." },
];

const testimonials = [
  {
    quote: "Career Genie's AI chatbot helped me figure out exactly which career path to take. The roadmap it generated was spot-on and I followed it to land my first dev job.",
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
  { q: "Is Career Genie completely free to use?", a: "Yes — all six AI tools are included for free. No subscription, no hidden fees. Create an account and get full access instantly." },
  { q: "Who is Career Genie built for?", a: "Career Genie is built for Pakistani students and fresh graduates who want AI-powered guidance to discover, prepare for, and land the right career." },
  { q: "How does the AI Career Chatbot work?", a: "It's powered by Llama 3.3 via Groq. You can ask it anything — career advice, job market questions, skill guidance — and get instant, intelligent responses." },
  { q: "Can I use the Interview Prep tool with voice input?", a: "Absolutely. You can speak your answers aloud using your microphone. The AI listens, transcribes, and gives you detailed feedback on your response." },
];

const Index = () => {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="neo-hero-bg pt-28 pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="neo-badge mx-auto mb-6 w-fit">
              <Sparkles className="w-3 h-3" />
              AI-Powered Career Platform for Pakistani Students
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-primary-foreground mb-6">
              UNLOCK YOUR<br />
              <span className="inline-block bg-background text-foreground px-4 py-1 border-2 border-foreground -rotate-1 mt-2">
                CAREER PATH
              </span>
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Six AI tools to discover your path, build the perfect resume, ace interviews, and land the job you dream of — 100% free.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="xl" className="neo-btn bg-background text-foreground hover:bg-background font-bold text-base px-8">
                <Link to="/login">Get Started Free <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="neo-btn bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-bold text-base px-8">
                <Link to="/services">Browse Tools</Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {["6 AI Tools", "100% Free", "No Subscription", "Built for Students"].map((s) => (
                <span key={s} className="neo-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">— Our Tools</p>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight">
              Pick a tool,<br />start growing.
            </h2>
          </div>
          <Button asChild variant="outline" className="neo-btn self-start md:self-auto font-bold">
            <Link to="/services">View all tools <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link key={t.title} to={t.path} className="neo-card-hover rounded-xl p-6 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-secondary border-2 border-foreground flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {t.emoji}
                </div>
                <div>
                  <h3 className="font-display font-black text-sm mb-1">{t.title}</h3>
                  <span className="neo-tag">{t.stat}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED TOOL ── */}
      <section className="neo-section-alt py-20">
        <div className="container">
          <div className="neo-card rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left */}
              <div className="p-10 lg:p-14 border-b lg:border-b-0 lg:border-r-[2.5px] border-foreground">
                <span className="neo-badge mb-6 inline-flex">
                  <Sparkles className="w-3 h-3" /> Featured Tool
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-4">
                  Meet your<br />
                  <span className="text-gradient-gold">AI Career Mentor</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Powered by Llama 3.3 via Groq, the AI Career Chatbot gives you instant, expert guidance on career paths, the Pakistani job market, skills to learn, and your next steps.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {["Career path discovery", "Pakistan job market insights", "Skills & learning guidance", "24/7 instant responses"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-medium">
                      <div className="w-5 h-5 rounded-md bg-primary border-2 border-foreground flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="default" className="neo-btn font-bold">
                  <Link to="/dashboard/chat">Try it now <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>

              {/* Right: chat preview */}
              <div className="p-10 lg:p-14 flex items-center justify-center bg-secondary/40">
                <div className="neo-card rounded-xl p-5 w-full max-w-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-foreground">
                    <div className="w-9 h-9 rounded-lg bg-primary border-2 border-foreground flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-black">Career Genie AI</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary border border-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="neo-card-green rounded-lg rounded-tl-none px-3 py-2 text-xs font-medium max-w-[85%]">
                      What career suits a CS graduate in Pakistan?
                    </div>
                    <div className="neo-card-primary rounded-lg rounded-tr-none px-3 py-2 text-xs font-medium ml-auto max-w-[85%]">
                      <strong>Software Engineering</strong> and <strong>Data Science</strong> are top picks right now!
                    </div>
                    <div className="neo-card-green rounded-lg rounded-tl-none px-3 py-2 text-xs font-medium max-w-[85%]">
                      Which skills should I learn first?
                    </div>
                    <div className="flex items-center gap-2 bg-muted border-2 border-foreground rounded-lg px-3 py-2">
                      <span className="flex-1 text-xs text-muted-foreground font-medium">Ask anything...</span>
                      <div className="w-5 h-5 rounded-md bg-primary border border-foreground flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CAREER GENIE ── */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">— Why Career Genie?</p>
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight">
            Everything you need<br />in one place.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {whyItems.map((item, i) => (
            <div key={item.title} className={`neo-card rounded-2xl p-8 ${i === 1 ? "neo-card-primary" : ""}`}>
              <div className={`w-14 h-14 rounded-xl border-2 border-foreground flex items-center justify-center mb-5 ${i === 1 ? "bg-primary-foreground" : "bg-primary"}`}>
                <item.icon className={`w-6 h-6 ${i === 1 ? "text-primary" : "text-primary-foreground"}`} />
              </div>
              <h3 className="font-display text-xl font-black mb-3">{item.title}</h3>
              <p className={`text-sm leading-relaxed ${i === 1 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="neo-section-alt py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">— Success Stories</p>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight">
              Students who<br />made it happen.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`neo-card rounded-2xl p-8 ${i === 0 ? "" : "rotate-1"}`}>
                <Quote className="w-8 h-8 text-primary mb-4" />
                <p className="text-sm leading-relaxed mb-6 font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary border-2 border-foreground flex items-center justify-center font-black text-sm text-primary-foreground shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-black text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="container py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">— FAQ</p>
            <h2 className="font-display text-4xl font-black tracking-tight">Common questions.</h2>
          </div>
          <Accordion.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <Accordion.Item key={i} value={`faq-${i}`} className="neo-card rounded-xl overflow-hidden">
                <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-black group hover:bg-secondary transition-colors [&[data-state=open]]:bg-secondary">
                  {faq.q}
                  <Plus className="w-4 h-4 shrink-0 ml-4 group-data-[state=open]:hidden" />
                  <Minus className="w-4 h-4 shrink-0 ml-4 hidden group-data-[state=open]:block text-primary" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-5 pt-2 text-sm text-muted-foreground leading-relaxed font-medium border-t-2 border-foreground data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container pb-28">
        <div className="neo-card-primary rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-4 right-6 text-6xl font-black text-primary-foreground/10 select-none">✦</div>
          <div className="absolute bottom-4 left-6 text-6xl font-black text-primary-foreground/10 select-none">✦</div>
          <div className="relative max-w-xl mx-auto">
            <img src={genieLogo} alt="Career Genie" className="w-16 h-16 object-contain mx-auto mb-6 border-2 border-primary-foreground rounded-xl" />
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-4 text-primary-foreground">
              Ready to start?
            </h2>
            <p className="text-primary-foreground/80 mb-8 leading-relaxed font-medium">
              Create a free account and get instant access to all six Career Genie tools — no credit card, no subscription, no catch.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="xl" className="neo-btn bg-background text-foreground hover:bg-background font-bold text-base px-8">
                <Link to="/signup">Create Free Account <Zap className="w-4 h-4" /></Link>
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

export default Index;
