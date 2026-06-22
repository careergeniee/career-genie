import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import genieLogo from "@/assets/genie-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlowOrbs } from "@/components/GlowOrbs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !confirm) {
            toast.error("Please fill in all fields");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await signup(email, password);
            setDone(true);
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                toast.error("This email is already registered. Try logging in.");
            } else {
                toast.error(err.message || "Signup failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <div className="relative min-h-screen hero-bg overflow-hidden flex items-center justify-center">
                <GlowOrbs />
                <div className="relative glass-card rounded-3xl p-10 max-w-md w-full mx-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-5">
                        <Mail className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h2 className="font-display text-2xl font-bold mb-3">Check your inbox!</h2>
                    <p className="text-muted-foreground mb-6">
                        We sent a verification link to <span className="text-primary font-semibold">{email}</span>.
                        Click it to activate your account, then come back to login.
                    </p>
                    <Button asChild variant="hero" className="w-full">
                        <Link to="/login">Go to Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen hero-bg overflow-hidden grid lg:grid-cols-2">
            <GlowOrbs />

            {/* Left - Branding */}
            <div className="relative hidden lg:flex items-center justify-center p-12 border-r border-border/60">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="relative text-center max-w-md space-y-4">
                    <img src={genieLogo} alt="Career Genie" className="w-24 h-24 object-contain mx-auto" />
                    <p className="font-display text-3xl font-bold">
                        Start your <span className="text-gradient-gold">career journey</span>
                    </p>
                    <p className="text-muted-foreground">
                        Join 50,000+ professionals already using Career Genie to land their dream roles.
                    </p>
                </div>
            </div>

            {/* Right - Form */}
            <div className="relative flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <img src={genieLogo} alt="Career Genie" className="w-11 h-11 object-contain shrink-0" />
                        <span className="font-display font-bold text-xl">
                            Career <span className="text-gradient-gold">Genie</span>
                        </span>
                    </Link>

                    <h1 className="font-display text-4xl font-bold mb-2">Create account</h1>
                    <p className="text-muted-foreground mb-8">Start your AI-powered career journey today</p>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="name" placeholder="Your full name" className="pl-10 h-12"
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="you@example.com" className="pl-10 h-12"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="password" type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters" className="pl-10 pr-10 h-12"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="confirm" type="password" placeholder="Re-enter password"
                                    className="pl-10 h-12" value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)} />
                            </div>
                        </div>

                        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;