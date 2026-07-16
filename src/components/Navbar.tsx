import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const scrollingDown = y > lastScrollY.current;
      // Ignore the rubber-band/bounce range at the very top so it never hides too eagerly
      setHidden(scrollingDown && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-4 inset-x-0 z-50 px-4 transition-transform duration-300",
        hidden && "-translate-y-[calc(100%+2rem)]"
      )}
    >
      <nav className="relative mx-auto max-w-5xl flex items-center justify-between h-16 px-3 pl-5 rounded-full bg-foreground/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <Link to="/" className="flex items-center gap-1 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/50 transition-all rounded-full" />
            <img src={genieLogo} alt="Career Genie" className="relative w-9 h-9 object-contain drop-shadow-sm shrink-0" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight leading-none text-background">
            Career <span className="text-gradient-gold">Genie</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => cn("px-4 py-2 text-sm font-medium rounded-full transition-colors", isActive ? "text-primary" : "text-background/60 hover:text-background")}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => cn("px-4 py-2 text-sm font-medium rounded-full transition-colors", isActive ? "text-primary" : "text-background/60 hover:text-background")}>About Us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => cn("px-4 py-2 text-sm font-medium rounded-full transition-colors", isActive ? "text-primary" : "text-background/60 hover:text-background")}>Contact Us</NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex rounded-full">
            <Link to="/login">Login</Link>
          </Button>
          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-background/10 text-background transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden mx-auto max-w-5xl mt-2 rounded-3xl bg-foreground/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] animate-fade-in">
          <div className="py-4 px-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl hover:bg-background/10 text-background text-sm font-medium">{l.name}</Link>
            ))}
            <Button asChild variant="hero" className="mt-3 rounded-full">
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
