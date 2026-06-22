import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Bot, FileText, MessageSquare, Map, GraduationCap, Globe2, ChevronDown } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import { cn } from "@/lib/utils";

const services = [
  { name: "AI Powered Chatbot", path: "/services/ai-chatbot", icon: Bot, desc: "Smart career assistant" },
  { name: "Resume Builder", path: "/services/resume-builder", icon: FileText, desc: "ATS-friendly resumes" },
  { name: "Interview Preparation", path: "/services/interview-prep", icon: MessageSquare, desc: "Mock interviews with AI" },
  { name: "Roadmap Following", path: "/services/roadmap", icon: Map, desc: "Step-by-step paths" },
  { name: "Senior Instructor", path: "/services/instructor", icon: GraduationCap, desc: "Expert mentorship" },
  { name: "3D Career Verse", path: "/services/career-verse", icon: Globe2, desc: "Immersive exploration" },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-border/60" />
      <nav className="container relative flex items-center justify-between h-[72px] py-3">
        <Link to="/" className="flex items-center gap-1 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/50 transition-all rounded-full" />
            <img src={genieLogo} alt="Career Genie" className="relative w-12 h-12 object-contain drop-shadow-sm shrink-0" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight leading-none">
            Career <span className="text-gradient-gold">Genie</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => cn("px-4 py-2 text-sm font-medium rounded-full transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>Home</NavLink>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className={cn("px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1", location.pathname.startsWith("/services") ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
              Services <ChevronDown className={cn("w-4 h-4 transition-transform", servicesOpen && "rotate-180")} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[480px] animate-fade-in">
                <div className="glass-card rounded-2xl p-3 grid grid-cols-2 gap-1">
                  {services.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <s.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                  <Link to="/services" className="col-span-2 mt-1 text-center text-xs font-medium text-primary py-2 rounded-lg hover:bg-primary/10 transition-colors">
                    View all services →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={({ isActive }) => cn("px-4 py-2 text-sm font-medium rounded-full transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>About Us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => cn("px-4 py-2 text-sm font-medium rounded-full transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>Contact Us</NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Login</Link>
          </Button>
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl hover:bg-secondary text-sm font-medium">{l.name}</Link>
            ))}
            <div className="px-4 pt-3 pb-1 text-xs uppercase tracking-wider text-muted-foreground">Services</div>
            {services.map((s) => (
              <Link key={s.path} to={s.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-sm">
                <s.icon className="w-4 h-4 text-primary" /> {s.name}
              </Link>
            ))}
            <Button asChild variant="hero" className="mt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};