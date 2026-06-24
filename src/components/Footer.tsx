import { Link } from "react-router-dom";
import genieLogo from "@/assets/genie-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t-2 border-foreground mt-0">
      <div className="container py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-lg bg-primary border-2 border-foreground flex items-center justify-center">
              <img src={genieLogo} alt="Career Genie" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-display font-black text-xl leading-none">
              Career <span className="text-primary">Genie</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm font-medium leading-relaxed">
            AI-powered career intelligence to help you discover, prepare for, and land your dream role — 100% free for Pakistani students.
          </p>
        </div>
        <div>
          <h3 className="font-black mb-4 text-sm uppercase tracking-wide">Product</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/services/ai-chatbot" className="hover:text-primary font-medium transition-colors">AI Chatbot</Link></li>
            <li><Link to="/services/resume-builder" className="hover:text-primary font-medium transition-colors">Resume Builder</Link></li>
            <li><Link to="/services/interview-prep" className="hover:text-primary font-medium transition-colors">Interview Prep</Link></li>
            <li><Link to="/services/roadmap" className="hover:text-primary font-medium transition-colors">Roadmaps</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-black mb-4 text-sm uppercase tracking-wide">Company</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary font-medium transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary font-medium transition-colors">Contact</Link></li>
            <li><Link to="/services" className="hover:text-primary font-medium transition-colors">All Services</Link></li>
            <li><Link to="/login" className="hover:text-primary font-medium transition-colors">Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-foreground">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-bold">
          <p>© {new Date().getFullYear()} Career Genie. All Rights Reserved · Powered by UMT TRIO.</p>
          <p>Made for ambitious careers. ✦</p>
        </div>
      </div>
    </footer>
  );
};
