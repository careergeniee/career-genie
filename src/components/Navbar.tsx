import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <Button asChild variant="hero" className="mt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};