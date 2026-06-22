import { Link } from "react-router-dom";
import { Bot, FileText, MessageSquare, Map, GraduationCap, Globe2, ArrowRight } from "lucide-react";
import { GlowOrbs } from "@/components/GlowOrbs";

const services = [
  { name: "AI Powered Chatbot", path: "/services/ai-chatbot", icon: Bot, desc: "Your 24/7 smart career assistant — ask anything, get instant clarity.", color: "from-primary to-primary-glow" },
  { name: "Resume Builder", path: "/services/resume-builder", icon: FileText, desc: "Build beautiful ATS-friendly resumes that pass every filter.", color: "from-accent to-accent-glow" },
  { name: "Interview Preparation", path: "/services/interview-prep", icon: MessageSquare, desc: "Mock interviews with realistic AI feedback and scoring.", color: "from-primary to-accent" },
  { name: "Roadmap Following", path: "/services/roadmap", icon: Map, desc: "Personalized, step-by-step paths to your target role.", color: "from-accent-glow to-primary" },
  { name: "Senior Instructor", path: "/services/instructor", icon: GraduationCap, desc: "Direct mentorship from industry experts who've been there.", color: "from-primary-glow to-accent-glow" },
  { name: "3D Career Verse", path: "/services/career-verse", icon: Globe2, desc: "Step into immersive 3D worlds and explore careers like never before.", color: "from-accent to-primary-glow" },
];

const Services = () => {
  return (
    <div className="relative">
      <section className="relative hero-bg overflow-hidden">
        <GlowOrbs />
        <div className="container relative py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">All services</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-5">A complete <span className="text-gradient-gold">career toolkit</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Six powerful tools, one unified platform — engineered to take you from where you are to where you want to be.</p>
        </div>
      </section>

      <section className="container pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link key={s.path} to={s.path} className="glass-card-hover rounded-2xl p-8 group block">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <s.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition">{s.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;