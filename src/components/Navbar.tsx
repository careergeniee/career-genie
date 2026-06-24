import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Bot, FileText, MessageSquare, Map, GraduationCap, ChevronDown } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import { cn } from "@/lib/utils";

const services = [
  { name: "AI Powered Chatbot", path: "/services/ai-chatbot", icon: Bot, desc: "Smart career assistant" },
  { name: "Resume Builder", path: "/services/resume-builder", icon: FileText, desc: "ATS-friendly resumes" },
  { name: "Interview Preparation", path: "/services/interview-prep", icon: MessageSquare, desc: "Mock interviews with AI" },
  { name: "Roadmap Following", path: "/services/roadmap", icon: Map, desc: "Step-by-step paths" },
  { name: "Senior Instructor", path: "/services/instructor", icon: GraduationCap, desc: "Expert mentorship" },
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
      <div className="absolute inset-0 bg-background border-b-2 border-foreground" />
      <nav className="container relative flex items-center justify-between h-[68px]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-primary border-2 border-foreground flex items-center justify-center">
            <img src={genieLogo} alt="Career Genie" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-display font-black text-xl tracking-tight leading-none">
            Career <span className="text-primary">Genie</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) => cn("px-4 py-2 text-sm font-bold rounded-lg transition-colors", isActive ? "bg-primary text-primary-foreground border-2 border-foreground" : "text-foreground hover:bg-secondary hover:border-2 hover:border-foreground border-2 border-transparent")}
          >
            Home
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className={cn("px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-1 border-2", location.pathname.startsWith("/services") ? "bg-primary text-primary-foreground border-foreground" : "text-foreground hover:bg-secondary border-transparent hover:border-foreground")}>
              Services <ChevronDown className={cn("w-4 h-4 transition-transform", servicesOpen && "rotate-180")} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[480px]">
                <div className="neo-card rounded-2xl p-3 grid grid-cols-2 gap-1 bg-background">
                  {services.map((s) => (
                    <Link
                      key={s.path}
                      to={s.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary border-2 border-transparent hover:border-foreground transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-secondary border-2 border-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <s.icon className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground font-medium truncate">{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                  <Link to="/services" className="col-span-2 mt-1 text-center text-xs font-black text-primary py-2 rounded-lg hover:bg-primary hover:text-primary-foreground border-2 border-transparent hover:border-foreground transition-all">
                    View all services →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) => cn("px-4 py-2 text-sm font-bold rounded-lg transition-colors border-2", isActive ? "bg-primary text-primary-foreground border-foreground" : "text-foreground hover:bg-secondary border-transparent hover:border-foreground")}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => cn("px-4 py-2 text-sm font-bold rounded-lg transition-colors border-2", isActive ? "bg-primary text-primary-foreground border-foreground" : "text-foreground hover:bg-secondary border-transparent hover:border-foreground")}
          >
            Contact Us
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="neo-btn hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary font-black border-foreground">
            <Link to="/login">Login</Link>
          </Button>
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border-2 border-foreground hover:bg-secondary transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-background border-b-2 border-foreground">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl hover:bg-secondary border-2 border-transparent hover:border-foreground text-sm font-black transition-all">{l.name}</Link>
            ))}
            <div className="px-4 pt-3 pb-1 text-xs uppercase tracking-wider font-black text-muted-foreground">Services</div>
            {services.map((s) => (
              <Link key={s.path} to={s.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary border-2 border-transparent hover:border-foreground text-sm font-bold transition-all">
                <s.icon className="w-4 h-4 text-primary" /> {s.name}
              </Link>
            ))}
            <Button asChild className="neo-btn mt-3 bg-primary text-primary-foreground hover:bg-primary font-black">
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
