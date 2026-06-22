import { Link, useParams, Navigate } from "react-router-dom";
import { Bot, FileText, MessageSquare, Map, GraduationCap, Globe2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";

const data = {
  "ai-chatbot": {
    icon: Bot,
    title: "AI Powered Chatbot",
    tagline: "Your 24/7 career copilot",
    desc: "Conversational AI that understands your goals, your industry, and your potential. Ask anything — from salary negotiation to skill gaps — and get expert-grade answers in seconds.",
    features: ["Trained on millions of career conversations", "Industry-specific guidance", "Personalized to your profile", "Available 24/7 across devices", "Confidential and secure"],
    cta: "Start chatting",
  },
  "resume-builder": {
    icon: FileText,
    title: "Resume Builder",
    tagline: "ATS-friendly resumes in minutes",
    desc: "Craft polished, recruiter-approved resumes with AI-driven content suggestions, real-time ATS scoring, and beautifully designed templates that stand out.",
    features: ["12+ premium templates", "Live ATS score", "AI bullet-point rewriter", "One-click PDF & DOCX export", "Tailor per job description"],
    cta: "Build my resume",
  },
  "interview-prep": {
    icon: MessageSquare,
    title: "Interview Preparation",
    tagline: "Practice until you're unstoppable",
    desc: "Realistic mock interviews with AI that listens, scores, and coaches you on tone, clarity, and content. Walk into the real thing with quiet confidence.",
    features: ["Role-specific question banks", "Behavioral & technical rounds", "Voice analysis & feedback", "Improvement tracking", "Industry expert reviews"],
    cta: "Start practicing",
  },
  roadmap: {
    icon: Map,
    title: "Roadmap Following",
    tagline: "Step-by-step paths to your dream role",
    desc: "Personalized career roadmaps that show exactly which skills, projects, and certifications to pursue — in the right order — to reach your target role.",
    features: ["Adaptive to your pace", "Curated learning resources", "Milestone tracking", "Skill validation", "Pivot suggestions when needed"],
    cta: "View my roadmap",
  },
  instructor: {
    icon: GraduationCap,
    title: "Senior Instructor",
    tagline: "Mentorship from those who've done it",
    desc: "Get matched with seasoned industry mentors for 1:1 sessions on career strategy, technical depth, leadership, and personal brand.",
    features: ["Vetted senior mentors", "1:1 video sessions", "Long-term mentorship plans", "Structured curriculum", "Lifetime access to alumni network"],
    cta: "Find a mentor",
  },
  "career-verse": {
    icon: Globe2,
    title: "3D Career Verse",
    tagline: "Explore careers like never before",
    desc: "Step into immersive 3D environments to experience real workplaces — from startup engineering floors to creative studios — before choosing your path.",
    features: ["Immersive 3D environments", "Day-in-the-life simulations", "VR-ready", "Talk to virtual professionals", "Discover hidden career paths"],
    cta: "Enter the verse",
  },
} as const;

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? data[slug as keyof typeof data] : undefined;
  if (!service) return <Navigate to="/services" replace />;

  const Icon = service.icon;

  return (
    <div>
      <section className="relative hero-bg overflow-hidden">
        <GlowOrbs />
        <div className="container relative py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-5 hover:underline">
              ← All services
            </Link>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-[0_0_30px_hsl(48_96%_53%_/_0.5)]">
                <Icon className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-gradient-gold font-semibold mb-5">{service.tagline}</p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{service.desc}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg"><Link to="/login">{service.cta} <ArrowRight className="w-4 h-4" /></Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/contact">Talk to us</Link></Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-purple opacity-20 blur-[100px] rounded-full" />
            <div className="relative glass-card rounded-3xl p-10">
              <div className="space-y-4">
                {service.features.map((f, i) => (
                  <div key={f} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border/60 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Powered by Career Genie AI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to get started with <span className="text-gradient-gold">{service.title}</span>?</h2>
          <p className="text-muted-foreground mb-8">Join thousands already using Career Genie to accelerate their journey.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="hero" size="lg"><Link to="/login">{service.cta}</Link></Button>
            <Button asChild variant="glass" size="lg"><Link to="/services">Explore other services</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;