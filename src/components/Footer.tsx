import { Link } from "react-router-dom";
import { GenieLampLogo } from "@/components/GenieLampLogo";

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/60 mt-24">
      <div className="container py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <GenieLampLogo size={38} className="text-primary" />
            <span className="font-display font-bold text-xl">Career <span className="text-gradient-gold">Genie</span></span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            AI-powered career intelligence to help you discover, prepare for, and land your dream role.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-sm">Product</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/services/ai-chatbot" className="hover:text-primary">AI Chatbot</Link></li>
            <li><Link to="/services/resume-builder" className="hover:text-primary">Resume Builder</Link></li>
            <li><Link to="/services/interview-prep" className="hover:text-primary">Interview Prep</Link></li>
            <li><Link to="/services/roadmap" className="hover:text-primary">Roadmaps</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-sm">Company</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/services" className="hover:text-primary">All Services</Link></li>
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Career Genie. Crafted with vision.|All Rights Reserved | Powered by UMT TRIO. </p>
          <p>Made for ambitious careers.</p>
        </div>
      </div>
    </footer>
  );
};